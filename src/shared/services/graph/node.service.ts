import { Chapter } from '@epoc/epoc-types/dist/v1';
import { EpocV1 } from '../../classes/epoc-v1';
import { useEditorStore, useGraphStore } from '../../stores';
import { useVueFlow, Node, MarkerType, Edge } from '@vue-flow/core';
import { NodeElement, SideAction } from '../../interfaces';
import { nextTick, toRaw, watch } from 'vue';
import { questions, standardPages } from '../../data';

import { addContentToPage, deleteContent } from './content.service';
import { generateContentId, generateId } from '../graph.service';

const { nodes, edges, vueFlowRef, addNodes, addEdges, findNode, project, applyEdgeChanges, applyNodeChanges } = useVueFlow({ id: 'main' });

const editorStore = useEditorStore();

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
    ePocValues.chapterParameter = epoc.parameters.chapterParameter;
}

export function addChapter(chapterId?: string, chapter?: Chapter) {
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
    const newYPos = chapters.length > 0 ? chapters[chapters.length - 1].position.y + 200 : 200;
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

export function createLinkedPage(element, contentElements) {
    const position = {
        x: element.position.x + 150,
        y: element.position.y
    };

    const pageNode: Node = {
        id: contentElements[0].id,
        type: 'content',
        data: {
            elements: contentElements,
            formType: 'page',
            formValues: {},
            type: 'template',
            contentId: generateContentId(),
        },
        position,
        deletable: false
    };

    const edge: Edge = {
        id: generateId(),
        source: element.id,
        target: contentElements[0].parentId,
        type: 'default',
        updatable: true,
        style: { stroke: '#384257', strokeWidth: 2.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#384257' }
    };

    addNodes([pageNode]);
    addEdges([edge]);

    return pageNode;
}

export function createPageFromContent(position, element: NodeElement) {
    const id = generateId();
    element.parentId = id;

    const newPageNode: Node = {
        id,
        type: 'content',
        data: {
            elements: [element],
            formType: 'page',
            formValues: {},
            type: 'question',
            contentId: generateContentId(),
        },
        position,
        deletable: false
    };

    addNodes([newPageNode]);

    addContentToPage(id, element.action);

    alignNode(newPageNode.id);

    document.querySelectorAll('.node .ghost').forEach((ghost) => {
        ghost.remove();
    });
}

export function addPage(position, actions: SideAction[]) {
    const questionTypes = ['qcm', 'dragdrop', 'reorder', 'swipe', 'list'];
    const elements: NodeElement[] = [];

    const id = generateId();

    actions.forEach((action) => {
        elements.push({
            id: generateId(),
            action,
            formType: action.type,
            formValues: {},
            parentId: id,
            contentId: generateContentId(),
        });
    });

    //! see if correct in v1
    const type = elements[0].action.type;
    const isQuestion = questionTypes.includes(type);
    const isCondition = type === 'condition';

    const finalType = isQuestion ? 'question' : (isCondition ? 'condition' : 'element');

    const newPageNode: Node = {
        id,
        type: 'content',
        data: {
            type: finalType,
            elements,
            contentId: generateContentId(),
            formType: 'page',
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


export function duplicatePage(): void {
    const pageNode = findNode(editorStore.openedNodeId);
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

export function addNewPage(type: string, pos: {x: number, y: number}): void {
    const types = standardPages.concat(questions);
    const id = generateId();

    const elements: NodeElement[] = [{
        id: generateId(),
        action: types.find(value => value.type === type),
        formType: type,
        formValues: {},
        parentId: id,
        contentId: generateId(),
    }];

    const { left, top } = vueFlowRef.value.getBoundingClientRect();
    const position = project({ x: pos.x - left, y: pos.y - top });

    const newPage: Node = {
        id,
        type: 'content',
        position,
        data: { type, elements, formType: 'page', formValues: {}, contentId: id},
    };

    addNodes([newPage]);

    alignNode(newPage.id);

    addContentToPage(id, elements[0].action);
}

export function getSelectedNodes(isChild: boolean): Node[] {
    const selectedNodes: Node[] = nodes.value.filter(node => node.selected && isNodeDeletable(node.id));

    //? Chapter nodes can't be selected but can be active
    const activeNode = isChild ? findNode(editorStore.openedNodeId) : findNode(editorStore.openedElementId);

    if(activeNode && isNodeDeletable(activeNode.id)) selectedNodes.push(activeNode);

    return selectedNodes;
}

export function alignNode(nodeId) {
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

    const selectedNodes = getSelectedNodes(isChild);

    if(isChild) {
        deleteElement(editorStore.openedElementId, editorStore.openedNodeId);
    } else {
        selectedNodes.forEach(node => deleteElement(node.id));
    }

    editorStore.closeValidationModal();
}

export function confirmDelete(): void {
    const isChild = Boolean(editorStore.openedNodeId);

    const selectedNodes = getSelectedNodes(isChild);
    const selectedEdges = edges.value.filter(edge => edge.selected);

    if(selectedNodes.length > 0 || isChild ) {
        editorStore.openValidationModal();
    } else if(selectedEdges.length > 0) {
        for(const edge of selectedNodes) {
            applyEdgeChanges([{ id: edge.id, type: 'remove' }]);
        }
    }
}

export function deleteNode(nodeId) {
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

export function moveNextChapter(chapterId: string) {
    const chapters = nodes.value.filter(node => node.type === 'chapter');

    for(const chapter of chapters) {
        if(chapter.id <= chapterId) return;

        chapter.position = { x: 0, y: chapter.position.y - 200 };
        chapter.data.title = `Chapitre ${Number(chapter.data.title.split(' ')[1] - 1)}`;
    }
}