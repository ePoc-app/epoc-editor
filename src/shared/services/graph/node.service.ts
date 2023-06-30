import { Chapter } from '@epoc/epoc-types/dist/v1';
import { EpocV1 } from '../../classes/epoc-v1';
import { useEditorStore, useGraphStore } from '../../stores';
import { useVueFlow, Node, MarkerType, Edge, getConnectedEdges } from '@vue-flow/core';
import { NodeElement, SideAction } from '../../interfaces';
import { nextTick, toRaw, watch } from 'vue';

import { addContentToPage, deleteContent } from './content.service';
import { generateContentId, generateId, graphService } from '../graph.service';
import { ApiInterface } from '../../interfaces/api.interface';

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

export function addPage(position: { x: number, y: number }, actions: SideAction[], noAlign?: boolean): string{
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

    if(!noAlign) alignNode(newPageNode.id);

    //? Conflicts with vue draggable on node edge
    document.querySelectorAll('.node .ghost').forEach((ghost) => {
        ghost.remove();
    });
    
    return newPageNode.id;
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
    
    addNodes([newPage]);

    createEdge(sourcePage.id, newPage.id);

    return newPage;
}

export function insertAfter(pageId: string, action: SideAction): void {
    const pageNode = findNode(pageId);
    const newPosition = {
        x: pageNode.position.x + 200, 
        y: pageNode.position.y
    };
    
    let sourceEdge = getConnectedEdges([pageNode], edges.value).find((edge) => edge.source === pageId);

    const newPageNodeId = addPage(newPosition, [action], true);
    createEdge(pageId, newPageNodeId);

    
    if(!sourceEdge) return;
    
    let targetNode = findNode(sourceEdge.target);
    applyEdgeChanges([{ id: sourceEdge.id, type: 'remove' }]);
    targetNode.position.x += 200;
    createEdge(newPageNodeId, targetNode.id);
    
    while(sourceEdge) {
        sourceEdge = getConnectedEdges([targetNode], edges.value).find((edge) => edge.source === targetNode.id);
        if(!sourceEdge) return;

        targetNode = findNode(sourceEdge.target);
        targetNode.position.x += 200;
    }
}

export function insertBefore(pageId: string, action: SideAction): void {
    const pageNode = findNode(pageId);
    const newPosition = {
        x: pageNode.position.x,
        y: pageNode.position.y
    };
    pageNode.position.x += 200;
    
    const targetEdge = getConnectedEdges([pageNode], edges.value).find((edge) => edge.target === pageId);
   
    const newPageNodeId = addPage(newPosition, [action], true);
    createEdge(newPageNodeId, pageId);
    
    if(targetEdge) {
        const sourceNode = findNode(targetEdge.source);
        applyEdgeChanges([{ id: targetEdge.id, type: 'remove' }]);
        createEdge(sourceNode.id, newPageNodeId);
    }

    let sourceEdge = getConnectedEdges([pageNode], edges.value).find((edge) => edge.source === pageId);
    if(!sourceEdge) return;

    let targetNode = findNode(sourceEdge.target);
    while(sourceEdge) {
        targetNode = findNode(sourceEdge.target);
        targetNode.position.x += 200;

        sourceEdge = getConnectedEdges([targetNode], edges.value).find((edge) => edge.source === targetNode.id);
        if(!sourceEdge) return;
    }
}

export function insertAtEnd(chapterId: string, action: SideAction): void {
    let nextNode = graphService.getNextNode(findNode(chapterId));
    let savedId = chapterId;
    
    while(nextNode) {
        savedId = nextNode.id;
        nextNode = graphService.getNextNode(findNode(nextNode.id));
    }
    
    console.log('finalNode', savedId);
    
    insertAfter(savedId, action);
}

export function insertAtStart(chapterId: string, action: SideAction): void {
    console.log('insertAtStart');
    const nextNode = graphService.getNextNode(findNode(chapterId));

    if(nextNode) insertBefore(nextNode.id, action);
    else insertAfter(chapterId, action);
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

export function createEdge(sourceId: string, targetId: string): void {
    const newEdge: Edge = {
        id: generateId(),
        source: sourceId,
        target: targetId,
        type: 'default',
        updatable: true,
        style: {stroke: '#384257', strokeWidth: 2.5},
        markerEnd: {type: MarkerType.ArrowClosed, color: '#384257'}
    };

    addEdges([newEdge]);
}

export function deleteSelectedNodes(): void {
    const isChild = Boolean(editorStore.openedNodeId);

    const selectedNodes = getSelectedNodes();

    if(isChild) {
        deleteElement(editorStore.openedElementId, editorStore.openedNodeId);
    } else {
        deleteSelection(selectedNodes);
    }

    editorStore.closeValidationModal();
}

export function deleteSelection(selection: Node[]) {
    selection.forEach(node => deleteElement(node.id));
}

export function deleteNode(nodeId: string): void {
    const nodeToDelete = findNode(nodeId);
    applyNodeChanges([{ id:nodeToDelete.id, type: 'remove'}]);

    if(nodeToDelete.type === 'chapter') updateNextChapter(nodeToDelete.id);
}

export function deleteElement(id: string, pageId?: string): void {
    const pageToDelete = findNode(id);

    if(pageId || !pageToDelete) deleteContent(pageId ?? editorStore.openedNodeId, id);
    else deleteNode(id);

    editorStore.closeFormPanel();
}

export function duplicatePage(pageId?: string): void {
    const pageNode = findNode(pageId ?? editorStore.openedElementId);
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

export function updateNextChapter(chapterId: string): void {
    const chapters = nodes.value.filter(node => node.type === 'chapter');

    for(const chapter of chapters) {
        if(chapter.id <= chapterId) return;

        chapter.data.title = `Chapitre ${Number(chapter.data.title.split(' ')[1] - 1)}`;
    }
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

export function getSelectedNodes(): Node[] {
    const selectedNodes: Node[] = nodes.value.filter(node => node.selected && isNodeDeletable(node.id));

    /*
    //? chapters node can't be selected but can be active
    const activeNode = isChild ? findNode(editorStore.openedNodeId) : findNode(editorStore.openedElementId);
    
    if(activeNode && isNodeDeletable(activeNode.id)) selectedNodes.push(activeNode);
    */
    
    return selectedNodes;
}

export function isNodeDeletable(id: string): boolean {
    const undeletableIds = ['1', '2'];
    return !undeletableIds.includes(id);
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

export function isFormButtonDisabled(isDisabledFunction: (node) => boolean): boolean {
    const isChild = Boolean(editorStore.openedNodeId);
    const nodeData = isChild ? findNode(editorStore.openedNodeId).data.elements.find(e => e.id === editorStore.openedElementId) : findNode(editorStore.openedElementId).data;
    return isDisabledFunction(nodeData);
}

export function unselectAllNodes(): void {
    nodes.value.forEach(node => node.selected = false);
}


// Copy/Paste
declare const api: ApiInterface;

function setupCopyPaste(): void {
    api.receive('graphPasted', (data: string) => {
        const parsedData = JSON.parse(data);
        const { selectedPages, position } = parsedData;
        handleGraphPaste(selectedPages, position);
    });
}

setupCopyPaste();

export function graphCopy(selection?: Node[]): void {
    if(!selection) selection = getSelectedNodes();
    const selectedPages = selection.filter(node => node.type === 'page' || node.type === 'activity');
    
    const data = JSON.stringify({ pages: selectedPages });
    
    api.send('graphCopy', data);
}

export function graphPaste(position?: { x: number, y: number }) {
    const data = JSON.stringify({ position });
    api.send('graphPaste', data);
}

function handleGraphPaste(selectedPages, position: { x: number, y: number }): void {
    if(!selectedPages) return;
    
    let offsetX;
    let offsetY;
    
    if(position) {
        offsetX = position.x - selectedPages[0].position.x;
        offsetY = position.y - selectedPages[0].position.y;
    } else {
        offsetX = 100;
        offsetY = 100;
    }

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
    // automatically copy the new pages so that they can be pasted again without superposition
    // api.send('graphCopy', { selectedPages: newPages, selectionRectHeight: offsetY });

    addNodes(newPages);
    
    for(const page of newPages) {
        alignNode(page.id);
    }
}