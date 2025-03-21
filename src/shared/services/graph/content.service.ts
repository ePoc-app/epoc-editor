import { useVueFlow } from '@vue-flow/core';
import { useEditorStore } from '../../stores';
import { NodeElement, SideAction } from '../../interfaces';
import { deleteNode } from './node.service';
import { closeFormPanel, generateContentId, generateId } from '../graph.service';
import * as forms from '@/src/shared/data/forms';
import { deleteConnectedConditions } from '@/src/shared/services';

const { nodes, findNode } = useVueFlow('main');

const editorStore = useEditorStore();

export function deleteContent(pageId: string, id: string): void {
    const pageNode = findNode(pageId);
    if (pageNode) {
        pageNode.data.elements.forEach((value: NodeElement, index: number) => {
            if (value.id === id) {
                deleteConnectedConditions(value.contentId);
                removeContentFromPage(index, pageId);
            }
        });
    }
}

export function duplicateContent(): void {
    const pageNode = findNode(editorStore.openedNodeId);
    const element = pageNode.data.elements.find((element: NodeElement) => element.id === editorStore.openedElementId);

    const newElement = JSON.parse(JSON.stringify(element));
    newElement.id = generateId();
    newElement.parentId = pageNode.id;

    addContentToPage(pageNode.id, newElement);
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
    closeFormPanel();

    const pageNode = findNode(pageId);
    pageNode.data.elements.splice(index, 1);

    if (editorStore.openedNodeId || pageMoved) {
        pageNode.data.formValues.components.splice(index, 1);
    }

    if (!pageNode.data.elements.length) {
        deleteNode(pageId);
    }
}

export function addContentToPage(pageId: string, content: SideAction | NodeElement, index?: number): void {
    const pageNode = findNode(pageId);
    index = index ?? pageNode.data.elements.length;

    if (!pageNode.data.formValues.components) pageNode.data.formValues.components = [];

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

export function unselectAllContents(): void {
    const contents = document.querySelectorAll('.btn-content');
    contents.forEach((content) => content.classList.remove('selected'));
}

export function getContentDefaultValues(type: string) {
    const form = [...forms.questionForms.value, ...forms.elementForms.value, ...forms.nodeForms.value].find(
        (f) => f.type === type,
    );

    return form.fields.reduce((acc, field) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const keyValues = field.inputs.reduce((_acc2: any, i) => {
            return { [i.id]: JSON.parse(JSON.stringify(i.value)) };
        }, {});
        return { ...acc, ...keyValues };
    }, {});
}

export function getContentByContentId(contentId: string) {
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

// translate v1 content to v2
export function setPageContents() {
    const pages = nodes.value.filter((node) => node.type === 'page');

    for (const page of pages) {
        // in v1 there is only one element per page
        const element: NodeElement = page.data.elements[0];
        element.contentId = generateContentId();
    }
}

export function findContent(id: string): NodeElement {
    for (const node of nodes.value) {
        if (node.data.elements) {
            for (const element of node.data.elements) {
                if (element.id === id) {
                    return element;
                }
            }
        }
    }
}
