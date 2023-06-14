import { Chapter } from '@epoc/epoc-types/dist/v1';
import { EpocV1 } from '../../classes/epoc-v1';
import { useEditorStore, useGraphStore } from '../../stores';
import { useVueFlow, Node, MarkerType, Edge } from '@vue-flow/core';
import { NodeElement, SideAction } from '../../interfaces';
import { nextTick, toRaw, watch } from 'vue';

import { addContentToPage, deleteContent } from './content.service';
import { generateContentId, generateId } from '../graph.service';

const { nodes, edges, addNodes, addEdges, findNode, applyEdgeChanges, applyNodeChanges } = useVueFlow({ id: 'main' });

const editorStore = useEditorStore();

const questionTypes = ['choice', 'drag-and-drop', 'reorder', 'swipe', 'dropdown-list'];

export function setEpocNodeData(epoc: EpocV1) {
    const { elements } = useGraphStore();

    const ePocValues = elements[0].data.formValues;
    ePocValues.id = epoc.id;
    ePocValues.title = epoc.title;
    ePocValues.image = epoc.image;
    ePocValues.objectives = epoc.objectives;
    ePocValues.summary = epoc.summary;
    ePocValues.teaser = epoc.teaser;
    ePocValues.thumbnail = epoc.thumbnail;
    ePocValues.version = epoc.version;
    ePocValues.certificateScore = epoc.certificateScore;
    ePocValues.authors = Object.values(epoc.authors);
    ePocValues.chapterParameter = epoc.parameters?.chapterParameter;
    ePocValues.plugins = epoc.plugins;
}

export function addChapter(chapterId?: string, chapter?: Chapter, offsetY?: number): Node {
    const chapters = nodes.value.filter(node => node.type === 'chapter');
    const data = {
        action: {icon: 'icon-chapitre', type: 'chapter'},
        formType: 'chapter',
        formValues: {},
        title: 'Chapitre ' + (chapters.length + 1),
        contentId: generateContentId()
    };
    if (chapterId && chapter) {
        data.contentId = chapterId;
        data.formValues = {
            title: chapter.title,
            objectives: chapter.objectives
        };
    }
    offsetY = offsetY ? offsetY : 0;
    const newYPos = chapters.length > 0 ? chapters[chapters.length - 1].position.y + 200 + offsetY : 200 + offsetY;
    const newChapter: Node = {
        id: (nodes.value.length + 1).toString(),
        type: 'chapter',
        position: { x: 0, y: newYPos },
        data,
        draggable: true,
        deletable: true,
        selectable: false
    };

    addNodes([newChapter]);

    return newChapter;
}

export function createLinkedPage(sourcePage: Node, type: 'activity'|'page', contentElements: NodeElement[], title: string, subtitle: string, id: string, hidden: boolean, conditional: boolean, contentId: string, summary?: string): Node {
    const position = {
        x: sourcePage.position.x + 150,
        y: sourcePage.position.y
    };
    const newPage: Node = {
        id: id,
        type: type,
        data: {
            elements: contentElements,
            readyToDrop: false,
            formType: type,
            formValues: {
                conditional,
                hidden,
                title,
                subtitle,
                summary,
                components: contentElements.map(c => {
                    return { action: c.action };
                })
            },
            type: 'template',
            contentId: contentId
        },
        position: position,
        deletable: false
    };

    const newEdge : Edge = {
        id: generateId(),
        source: sourcePage.id,
        target: newPage.id,
        type: 'default',
        updatable: true,
        style: {stroke: '#384257', strokeWidth: 2.5},
        markerEnd: {type: MarkerType.ArrowClosed, color: '#384257'}
    };
    addNodes([newPage]);
    addEdges([newEdge]);
    return newPage;
}

export function createPageFromContent(position: { x: number, y: number }, element: NodeElement): void {
    const id = generateId();
    const oldPageNode = findNode(element.parentId);
    element.parentId = id;

    const newPageNode: Node = {
        id,
        type: oldPageNode.type,
        data: {
            type: oldPageNode.data.type,
            elements: [],
            formType: oldPageNode.data.formType,
            formValues: {},
            contentId: generateContentId(),
        },
        position,
        deletable: false
    };

    addNodes([newPageNode]);

    addContentToPage(id, element);

    alignNode(newPageNode.id);

    document.querySelectorAll('.node .ghost').forEach((ghost) => {
        ghost.remove();
    });
}

export function addPage(position: { x: number, y: number }, actions: SideAction[]): void {
    const id = generateId();

    //! see if correct in v1
    const type = actions[0].type;
    const isQuestion = questionTypes.includes(type);
    const isCondition = type === 'condition';

    const finalType = isQuestion ? 'question' : (isCondition ? 'condition' : 'element');

    const newPageNode: Node = {
        id,
        type: isQuestion ? 'activity' : 'page',
        data: {
            type: finalType,
            elements: [],
            contentId: generateContentId(),
            formType: isQuestion ? 'activity' : 'page',
            formValues: {},
        },
        position,
        deletable: true
    };

    addNodes([newPageNode]);

    actions.forEach((action) => {
        addContentToPage(id, action);
    });

    alignNode(newPageNode.id);

    //? Conflicts with vue draggable on node edge
    document.querySelectorAll('.node .ghost').forEach((ghost) => {
        ghost.remove();
    });
}

export function transformActivityToPage(): void {
    const pageNode = findNode(editorStore.openedElementId);
    if (pageNode.data.elements.length > 1) return;
    pageNode.type = 'page';
    pageNode.data.formType = 'page';
    delete pageNode.data.formValues.summary;
    editorStore.closeFormPanel();
    editorStore.openFormPanel(pageNode.id, pageNode.data.formType);
}


export function duplicatePage(): void {
    const pageNode = findNode(editorStore.openedElementId);
    const newElements = [];

    const nodeId = generateId();

    for(const elements of pageNode.data.elements) {
        const newElement = JSON.parse(JSON.stringify(elements));
        newElement.id = generateId();
        newElement.parentId = nodeId;
        newElements.push(newElement);
    }

    const newPage: Node = {
        id: nodeId,
        type: pageNode.type,
        position: { x: pageNode.position.x + 150, y: pageNode.position.y },
        data: {
            elements: newElements,
            formType: 'page',
            formValues: JSON.parse(JSON.stringify(toRaw(pageNode.data.formValues))),
            type: pageNode.data.type,
            contentId: generateContentId(),
        }
    };

    addNodes([newPage]);
    editorStore.closeFormPanel();
}

export function getSelectedNodes(): Node[] {
    const selectedNodes: Node[] = nodes.value.filter(node => node.selected && isNodeDeletable(node.id));

    /*
    //? chapters node can't be selected but can be active
    const activeNode = isChild ? findNode(editorStore.openedNodeId) : findNode(editorStore.openedElementId);
    
    if(activeNode && isNodeDeletable(activeNode.id)) selectedNodes.push(activeNode);
    */
    
    return selectedNodes;
}

export function alignNode(nodeId: string): void {
    nextTick(() => {
        const node = findNode(nodeId);
        const stop = watch(
            () => node.dimensions,
            (dimensions) => {
                if(dimensions.width > 0 && dimensions.height > 0) {
                    node.position = { x: node.position.x - node.dimensions.width / 2, y: node.position.y - node.dimensions.height / 2 };
                    stop();
                }
            },
            { deep: true, flush: 'post' },
        );
    });
}

export function isNodeDeletable(id: string): boolean {
    const undeletableIds = ['1', '2'];
    return !undeletableIds.includes(id);
}

export function deleteSelectedNodes(): void {
    const isChild = Boolean(editorStore.openedNodeId);

    const selectedNodes = getSelectedNodes();

    if(isChild) {
        deleteElement(editorStore.openedElementId, editorStore.openedNodeId);
    } else {
        selectedNodes.forEach(node => deleteElement(node.id));
    }

    editorStore.closeValidationModal();
}

export function confirmDelete(): void {
    const isChild = Boolean(editorStore.openedNodeId);

    const selectedNodes = getSelectedNodes();
    const selectedEdges = edges.value.filter(edge => edge.selected);

    if(selectedNodes.length > 0 || isChild ) {
        editorStore.openValidationModal();
    } else if(selectedEdges.length > 0) {
        for(const edge of selectedEdges) {
            applyEdgeChanges([{ id: edge.id, type: 'remove' }]);
        }
    }
}

export function deleteNode(nodeId: string): void {
    const nodeToDelete = findNode(nodeId);
    applyNodeChanges([{ id:nodeToDelete.id, type: 'remove'}]);

    if(nodeToDelete.type === 'chapter') moveNextChapter(nodeToDelete.id);
}

export function deleteElement(id: string, pageId?: string): void {
    const pageToDelete = findNode(id);

    if(pageId || !pageToDelete) deleteContent(pageId ?? editorStore.openedNodeId, id);
    else deleteNode(id);

    editorStore.closeFormPanel();
}

export function moveNextChapter(chapterId: string): void {
    const chapters = nodes.value.filter(node => node.type === 'chapter');

    for(const chapter of chapters) {
        if(chapter.id <= chapterId) return;

        chapter.position = { x: 0, y: chapter.position.y - 200 };
        chapter.data.title = `Chapitre ${Number(chapter.data.title.split(' ')[1] - 1)}`;
    }
}

export function isFormButtonDisabled(isDisabledFunction: (node) => boolean): boolean {
    const isChild = Boolean(editorStore.openedNodeId);
    const nodeData = isChild ? findNode(editorStore.openedNodeId).data.elements.find(e => e.id === editorStore.openedElementId) : findNode(editorStore.openedElementId).data;
    return isDisabledFunction(nodeData);
}


// Copy/Paste

let selectedPages = null;
let selectionRectHeight = null;

export function graphCopy(): void {
    const selectedNodes = getSelectedNodes();
    selectedPages = selectedNodes.filter(node => node.type === 'page' || node.type === 'activity');
    
    const selectionRect = document.querySelector('.vue-flow__nodesselection-rect') as HTMLElement;
    
    //height of the selection rect
    if(selectionRect) {
        selectionRectHeight = selectionRect.offsetHeight;
    }
}

//TODO: Have to detect the position of multiple pages inside a selection to paste them at the right place
export function graphPaste(): void {
    if(!selectedPages) return;
    
    const offsetY = selectionRectHeight ? selectionRectHeight : 100;
    const offsetX = selectionRectHeight ? 0 : 100;

    const newPages = [];
    for(const page of selectedPages) {
        const pageId = generateId();
        
        const elements = page.data.elements.map(element => {
            const newElement = JSON.parse(JSON.stringify(element));
            newElement.id = generateId();
            newElement.parentId = pageId;
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
            deletable: true
        };
        newPages.push(newPage);
    }
    
    // deselect the old pages
    for(const page of selectedPages) {
        page.selected = false;
    }
    
    // select the new pages
    for(const page of newPages) {
        page.selected = true;
    }

    selectedPages = newPages;

    addNodes(newPages);
}