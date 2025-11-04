import { useVueFlow, Node, MarkerType, Edge, GraphEdge } from '@vue-flow/core';
import { deleteContent, deleteNode, getContentByContentId } from './';
import { useEditorStore } from '@/src/shared/stores';
import { closeFormPanel, exitSelectNodeMode, generateId, graphService } from '../graph.service';
import { ElementType, NodeElement } from '../../interfaces';
import { i18n } from '@/i18n/config';

const { nodes, findNode, addEdges, edges } = useVueFlow('main');
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

export function getSelectedEdges(): GraphEdge[] {
    return edges.value.filter((edge) => edge.selected);
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
    const node = nodes.value.find((node) => node.data.contentId === contentId || node.id === contentId);

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

    console.log('type', node.type);

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

function getParentChapter(nodeId: string): Node | null {
    const chapters = nodes.value.filter((node) => node.type === 'chapter');
    
    for (const chapter of chapters) {
        let currentNode = graphService.getNextNode(chapter);
        while (currentNode && currentNode.type !== 'chapter') {
            if (currentNode.id === nodeId) {
                return chapter;
            }
            currentNode = graphService.getNextNode(currentNode);
        }
    }
    
    return null;
}

function getNodeTitle(node: Node): string {
    if (node.type === 'activity') {
        return node.data.formValues?.title || i18n.global.t('forms.node.activity');
    }
    if (node.type === 'page') {
        return node.data.formValues?.title || i18n.global.t('forms.node.page.title');
    }
    if (node.type === 'chapter') {
        console.log(node.data);
        return node.data.formValues?.title || i18n.global.t('global.chapter');
    }
    return node.data.title || '';
}

export function getElementLabel(contentId: string): { fullPath: string[]; shortLabel: string; } {
    const element = getElementByContentId(contentId);
    if (!element) return { fullPath: [contentId], shortLabel: contentId };

    const nodePath: string[] = [];

    if (Object.hasOwn(element, 'parentId')) {
        const nodeElement = element as NodeElement;
        const parentNode = findNode(nodeElement.parentId);
        if (!parentNode) return { fullPath: [contentId], shortLabel: contentId };

        const elementType = nodeElement.action.label || nodeElement.action.type;
        const pageTitle = getNodeTitle(parentNode);
        
        const parentChapter = getParentChapter(parentNode.id);
        if (parentChapter) {
            nodePath.push(getNodeTitle(parentChapter));
        }
        
        nodePath.push(pageTitle);
        nodePath.push(elementType);

        const shortLabel = `${pageTitle} - ${elementType}`;
        return { fullPath: nodePath, shortLabel };
    }
    
    const node = element as Node;
    
    if (node.type === 'chapter') {
        const title = getNodeTitle(node);
        return { fullPath: [title], shortLabel: title };
    }

    if (node.type === 'page' || node.type === 'activity') {
        const nodeTitle = getNodeTitle(node);
        const parentChapter = getParentChapter(node.id);
        
        if (parentChapter) {
            const fullPath = [getNodeTitle(parentChapter), nodeTitle];
            return { fullPath, shortLabel: nodeTitle };
        }

        return { fullPath: [nodeTitle], shortLabel: nodeTitle };
    }

    const title = node.data.title || contentId;
    return { fullPath: [title], shortLabel: title };
}
