import { useVueFlow } from '@vue-flow/core';
import { useUndoRedoStore, useGraphStore, useEditorStore } from '../stores';
import { ePocState } from '../interfaces';
import { ApiInterface } from '../interfaces/api.interface';

const { toObject }  = useVueFlow({ id: 'main' });

declare const api: ApiInterface;

let initialized = false;

export function setupUndo() {
    if (initialized) return;

    const undoRedoStore = useUndoRedoStore();
    api.receive('undo', () => {
        undoRedoStore.undo();
    });

    api.receive('redo', () => {
        undoRedoStore.redo();
    });
    initialized = true;
}

export function getCurrentState(saveForm?: boolean | object): string {
    const editorStore = useEditorStore();

    // noinspection JSUnusedAssignment
    let form = null;
    
    if(typeof saveForm === 'object') {
        form = saveForm; 
    } else {
        form = saveForm ? {
            elementId: editorStore.openedElementId,
            formType: editorStore.formPanel?.type,
            nodeId: editorStore.openedNodeId,
            badgeId: editorStore.openedBadgeId,
            scrollPosY: document.querySelector('.formPanel')?.scrollTop
        } : null;
    }
    
    const currentState: ePocState = {
        flow: toObject(),
        form
    };
    
    return JSON.stringify(currentState);
}

export function saveState(saveForm?: boolean): void {
    const undoRedoStore = useUndoRedoStore();
    const currentState = getCurrentState(saveForm);

    undoRedoStore.addState(currentState);
}

export function saveGivenState(state: string): void {
    const undoRedoStore = useUndoRedoStore();
    undoRedoStore.addState(state);
}

export function revertToState(state: string): string {
    const graphStore = useGraphStore();
    const editorStore = useEditorStore();
    
    editorStore.closeFormPanel();

    const { flow, form } = JSON.parse(state);

    const currentState = getCurrentState(form);
    graphStore.setFlow(flow);

    if(form) {
        const { elementId, nodeId, formType, scrollPosY, badgeId } = form;

        if(formType === 'badge') editorStore.openBadgeFormPanel(badgeId, 'custom', scrollPosY);
        else editorStore.openFormPanel(elementId, formType, nodeId, scrollPosY);
    }
    
    return currentState;
}