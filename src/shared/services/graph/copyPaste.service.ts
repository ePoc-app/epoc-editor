import { ApiInterface } from '@/src/shared/interfaces/api.interface';
import { getSelectedNodes, alignNode } from '.';
import { useVueFlow, Node, GraphNode, GraphEdge } from '@vue-flow/core';
import { generateId, generateContentId, graphService } from '../graph.service';
import { NodeElement } from '@/src/shared/interfaces';
import { createEdge, getSelectedEdges, addChapter, addLinkedPage } from '@/src/shared/services';

const { addNodes, findNode } = useVueFlow('main');

declare const api: ApiInterface;

function setupCopyPaste(): void {
    api.receive('graphPasted', (data: string) => {
        const parsedData = JSON.parse(data);
        const { selectedPages, selectedEdges, position, chapter } = parsedData;
        if (chapter) handleGraphChapterPaste(chapter, selectedPages);
        else handleGraphPaste(selectedPages, selectedEdges, position);
    });
}

setupCopyPaste();

export function graphCopy(selection?: { pages: Node[], edges?: GraphEdge[] }) {
    if (!selection) selection = { pages: getSelectedNodes(), edges: getSelectedEdges() };

    const selectedPages = selection.pages.filter((node) => node.type === 'page' || node.type === 'activity');
    const selectedEdges = selection.edges.filter((edge) => selectedPages.some((page) => page.id === edge.source) && selectedPages.some((page) => page.id === edge.target));

    const data = JSON.stringify({ pages: selectedPages, edges: selectedEdges });

    api.send('graphCopy', data);
}

export function graphPaste(position?: { x: number; y: number }) {
    const data = JSON.stringify({ position });
    api.send('graphPaste', data);
}

function handleGraphPaste(selectedPages: GraphNode[], selectedEdges: GraphEdge[], position: { x: number; y: number }): void {
    if (!selectedPages) return;

    let offsetX: number;
    let offsetY: number;

    if (position) {
        offsetX = position.x - selectedPages[0].position.x;
        offsetY = position.y - selectedPages[0].position.y;
    } else {
        offsetX = 100;
        offsetY = 100;
    }

    const newPages = [];
    const pagesMap = new Map();
    for (const page of selectedPages) {
        const pageId = generateId();
        pagesMap.set(page.id, pageId);

        const elements = page.data.elements.map((element: NodeElement) => {
            const newElement = JSON.parse(JSON.stringify(element));
            newElement.id = generateId();
            newElement.parentId = pageId;
            newElement.contentId = generateContentId();
            return newElement;
        });

        const newPage: Node = {
            id: pageId,
            type: page.type,
            data: {
                type: page.data.type,
                elements,
                contentId: generateContentId(),
                formType: page.data.formType,
                formValues: JSON.parse(JSON.stringify(page.data.formValues)),
            },
            position: { x: page.position.x + offsetX, y: page.position.y + offsetY },
            deletable: true,
        };
        newPages.push(newPage);
    }


    // deselect the old pages
    for (const page of selectedPages) {
        page.selected = false;
    }

    for (const edge of selectedEdges) {
        edge.selected = false;
    }

    // select the new pages
    for (const page of newPages) {
        page.selected = true;
    }
    // automatically copy the new pages so that they can be pasted again without superposition
    // api.send('graphCopy', { selectedPages: newPages, selectionRectHeight: offsetY });

    addNodes(newPages);

    for (const edge of selectedEdges) {
        const sourceId = pagesMap.get(edge.sourceNode.id);
        const targetId = pagesMap.get(edge.targetNode.id);

        createEdge(sourceId, targetId);
    }

    for (const page of newPages) {
        alignNode(page.id);
    }
}

export function graphChapterCopy(id: string) {
    const chapter = findNode(id);
    const pages = [];

    let nextNode = graphService.getNextNode(chapter);
    while (nextNode) {
        pages.push(nextNode);
        nextNode = graphService.getNextNode(nextNode);
    }

    const data = JSON.stringify({ chapter, pages });

    api.send('graphCopy', data);
}

export function handleGraphChapterPaste(chapter: GraphNode, pages: GraphNode[]) {
    const newChapter = addChapter(generateId(), {
        title: chapter.data.formValues.title,
        contents: [],
        duration: chapter.data.formValues.duration,
        objectives: chapter.data.formValues.objectives,
    });

    let previousPage = newChapter;
    for (const page of pages) {
        const pageId = generateId();

        const elements = page.data.elements.map((element: NodeElement) => {
            const newElement = JSON.parse(JSON.stringify(element));
            newElement.id = generateId();
            newElement.parentId = pageId;
            newElement.contentId = generateContentId();
            return newElement;
        });

        const newPage: Node = {
            id: pageId,
            type: page.type,
            data: {
                type: page.data.type,
                elements,
                contentId: generateContentId(),
                formType: page.data.formType,
                formValues: JSON.parse(JSON.stringify(page.data.formValues)),
            },
            position: { x: previousPage.position.x + 150, y: previousPage.position.y },
            deletable: true,
        };

        addLinkedPage(previousPage, newPage);
        previousPage = newPage;
    }
}
