import { useEditorStore} from '../../stores';
import { useVueFlow } from '@vue-flow/core';

const editorStore = useEditorStore();
const { findNode } = useVueFlow({ id: 'main' });

export function updateElementValue(elementId: string, nodeId: string, valueId: string, value: string): void {
    const { id, formType, formValues } = getElementInfo(elementId, nodeId);
    
    verifyAndOpenFormPanel(id, formType, formValues, nodeId);

    formValues[valueId] = value;
}

export function updateRepeatElementValue(elementId: string, nodeId: string, valueId: string, value: string, repeatIndex: number, repeatId: string): void {
    const { id, formType, formValues } = getElementInfo(elementId, nodeId);
    
    verifyAndOpenFormPanel(id, formType, formValues, nodeId);

    const repeatInput = formValues[valueId][repeatIndex];
    repeatInput[repeatId] = value;
}

export function removeRepeatElement(elementId: string, nodeId: string, formValueId: string, index: number): void {
    const { id, formType, formValues } = getElementInfo(elementId, nodeId);
    
    verifyAndOpenFormPanel(id, formType, formValues, nodeId);
    
    formValues[formValueId].splice(index, 1);
}

export function addRepeatElement(elementId: string, nodeId: string, formValueId: string, repeatElement, index: number): void {
    const { id, formType, formValues } = getElementInfo(elementId, nodeId);
    
    verifyAndOpenFormPanel(id, formType, formValues, nodeId);
    
    if(typeof repeatElement === 'string') repeatElement = JSON.parse(repeatElement);

    index === -1 ? formValues[formValueId].push(repeatElement) : formValues[formValueId].splice(index, 0, repeatElement);
}

export function moveRepeatElement(elementId: string, nodeId: string, formValueId: string, oldIndex: number, newIndex: number): void {
    const { id, formType, formValues } = getElementInfo(elementId, nodeId);
    
    verifyAndOpenFormPanel(id, formType, formValues, nodeId);

    const [repeatElement] = formValues[formValueId].splice(oldIndex, 1);
    formValues[formValueId].splice(newIndex, 0, repeatElement);
}

function getElementInfo(elementId: string, nodeId: string): {id: string, formType: string, formValues: any} {
    const node = findNode(nodeId);

    let id, formType, formValues;
    if(nodeId === elementId) {
        id = node.id;
        ({ formType, formValues } = node.data);
    } else {
        const element = node.data.elements.find(e => e.id === elementId);
        ({ id, formType, formValues } = element);
    }
    
    return { id, formType, formValues };
}

function verifyAndOpenFormPanel(id: string, formType: string, formValues, parentId: string): void {
    if(editorStore.openedElementId !== id) {
        editorStore.openFormPanel(id, formType, formValues, parentId);
    }
}