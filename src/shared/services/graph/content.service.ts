import { useVueFlow } from '@vue-flow/core';
import { useEditorStore } from '../../stores';
import { SideAction } from '../../interfaces';
import { deleteNode } from './node.service';
import { generateId } from '../graph.service';

const { findNode } = useVueFlow({ id: 'main' });

const editorStore = useEditorStore();

export function deleteContent(pageId: string, id: string): void {
    const pageNode = findNode(pageId);
    if(pageNode) {
        pageNode.data.elements.forEach((value, index) => {
            if(value.id === id) {
                removeContentFromPage(index, pageId);
            }
        });
    }
}

export function duplicateContent(): void {
    const pageNode = findNode(editorStore.openedNodeId);
    const element = pageNode.data.elements.find(element => element.id === editorStore.openedElementId);

    const newElement = JSON.parse(JSON.stringify(element));
    newElement.id = generateId();
    newElement.parentId = pageNode.id;

    pageNode.data.elements.push(newElement);
    addContentToPage(pageNode.id, newElement.action);
}

export function changeContentOrder(startIndex: number, finalIndex: number, pageId: string): void {
    const pageNode = findNode(pageId);

    const { elements, formValues } = pageNode.data;

    const [tmpElem] = elements.splice(startIndex, 1);
    elements.splice(finalIndex, 0, tmpElem);

    const [tmpValues] = formValues.components.splice(startIndex, 1);
    formValues.components.splice(finalIndex, 0, tmpValues);
}

//? The parameter pageMoved is used when openedParentId is not usable
export function removeContentFromPage(index: number, pageId: string, pageMoved?: boolean): void {
    editorStore.closeFormPanel();

    const pageNode = findNode(pageId);
    pageNode.data.elements.splice(index, 1);

    if(editorStore.openedNodeId || pageMoved) {
        pageNode.data.formValues.components.splice(index, 1);
    }

    if(!pageNode.data.elements.length) {
        deleteNode(pageId);
    }
}

export function addContentToPage(pageId: string, action: SideAction, index?: number): void {
    const pageNode = findNode(pageId);

    if(!pageNode.data.formValues.components) pageNode.data.formValues.components = [];

    const { formValues } = pageNode.data;

    if(!formValues.components) formValues.components = [];

    if(index !== undefined) {
        formValues.components.splice(index, 0, { action });
    } else {
        formValues.components.push({ action });
    }
}