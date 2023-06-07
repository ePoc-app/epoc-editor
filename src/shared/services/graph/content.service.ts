import { useVueFlow } from '@vue-flow/core';
import { useEditorStore } from '../../stores';
import {NodeElement, SideAction} from '../../interfaces';
import { deleteNode } from './node.service';
import {generateContentId, generateId} from '../graph.service';
import * as forms from '@/src/shared/data/forms';

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

export function addContentToPage(pageId: string, content: SideAction | NodeElement, index?: number): void {
    const pageNode = findNode(pageId);

    if(!pageNode.data.formValues.components) pageNode.data.formValues.components = [];

    // Déplacement d'un contenu existant (depuis une autre page)
    if ('action' in content) {
        pageNode.data.elements.splice(index, 0, { ...content, parentId: pageId });
        pageNode.data.formValues.components.splice(index, 0, { action: content.action });
    // Ajout d'un nouveau contenu depuis la sidebar
    } else {
        const newContent = {
            id: generateId(),
            action: content,
            formType: content.type,
            formValues: getContentDefaultValues(content.type),
            parentId: pageId,
            contentId: generateContentId(),
        };
        pageNode.data.elements.splice(index, 0, newContent);
        pageNode.data.formValues.components.splice(index, 0, { action: content });
    }
}

export function getContentDefaultValues(type) {
    const form = [...forms.questionForms, ...forms.elementForms, ...forms.nodeForms].find(f => f.type === type);

    return form.fields.reduce((acc, field) => {
        const keyValues = field.inputs.reduce((acc2, i) => {
            return {[i.id] : i.value};
        }, {});
        return {...acc, ...keyValues};
    }, {});
}
