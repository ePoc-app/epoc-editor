import { useVueFlow, Node, MarkerType, Edge } from '@vue-flow/core';
import { deleteContent, deleteNode, getContentByContentId } from './';
import { useEditorStore } from '@/src/shared/stores';
import { closeFormPanel, exitSelectNodeMode, generateId } from '../graph.service';
import { ElementType, NodeElement } from '../../interfaces';

const { nodes, findNode, addEdges } = useVueFlow({ id: 'main' });
const editorStore = useEditorStore();

export function deleteSelection(selection: Node[]) {
    selection.forEach((node) => deleteElement(node.id));
}

export function deleteElement(id: string, pageId?: string): void {
    const pageToDelete = findNode(id);

    if (pageId || !pageToDelete) deleteContent(pageId ?? editorStore.openedNodeId, id);
    else deleteNode(id);

    closeFormPanel();
}

export function createEdge(sourceId: string, targetId: string): void {
    const newEdge: Edge = {
        id: generateId(),
        source: sourceId,
        target: targetId,
        type: 'default',
        updatable: true,
        style: { stroke: '#384257', strokeWidth: 2.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#384257' },
    };

    addEdges([newEdge]);
}

export function getContentIdFromId(id: string): string {
    if (id === '1') return 'ePoc';
    const node = findNode(id);
    let contentId: string;
    if (!node) {
        for (const node of nodes.value) {
            if (node.data.elements) {
                for (const element of node.data.elements) {
                    if (element.id === id) contentId = element.contentId;
                }
            }
        }
    } else {
        contentId = node.data.contentId;
    }

    return contentId;
}

export function getElementByContentId(contentId: string): Node | NodeElement {
    const node = nodes.value.find((node) => node.data.contentId === contentId);

    if (!node) {
        for (const node of nodes.value) {
            if (node.data.elements) {
                for (const element of node.data.elements) {
                    if (element.contentId === contentId) {
                        return element;
                    }
                }
            }
        }
    }

    return node;
}

const questions = ['choice', 'drag-and-drop', 'reorder', 'swipe', 'dropdown-list'];
function getContentType(contentId: string): ElementType {
    const content = getContentByContentId(contentId);

    if (!content) return;
    if (content.action.type === 'text') return 'html';
    else if (questions.includes(content.action.type)) return 'question';
    else return content.action.type;
}

export function getElementType(contentId: string): ElementType {
    if (contentId === 'ePoc') return;

    const node = nodes.value.find((node) => node.data.contentId === contentId);

    if (!node) {
        return getContentType(contentId);
    }

    return node.type as ElementType;
}

export function openFormPanel(element: NodeElement) {
    if (editorStore.selectNodeMode) {
        exitSelectNodeMode(element.id);
    } else {
        editorStore.openFormPanel(element.id, element.formType, { nodeId: element.parentId });
    }
}

export function goToElement(contentId: string) {
    const element = getElementByContentId(contentId);
    if (!element) return;

    if (Object.hasOwn(element, 'parentId')) {
        const nodeElement = element as NodeElement;
        editorStore.openFormPanel(nodeElement.id, nodeElement.formType, {
            nodeId: nodeElement.parentId,
            centerNode: true,
        });
    } else {
        const node = element as Node;
        editorStore.openFormPanel(node.id, node.data.formType, { centerNode: true });
    }
}
