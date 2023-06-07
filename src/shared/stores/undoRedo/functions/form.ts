import { FormRepeatChangeAction, FormRepeatMoveAction, FormRepeatMutateAction, FormRepeatUpdatedAction, FormUpdatedAction, UndoRedoAction } from '@/src/shared/interfaces';
import { addRepeatElement, moveRepeatElement, removeRepeatElement, updateElementValue, updateRepeatElementValue } from '@/src/shared/services/graph';

export function updateFormAction(action: FormUpdatedAction, reverseStack: UndoRedoAction[]): void {
    const { elementId, nodeId, formValueId, oldValue, newValue } = action;
    
    updateElementValue(elementId, nodeId, formValueId, oldValue);
    
    const reverseAction: FormUpdatedAction = {
        ...action,
        oldValue: newValue,
        newValue: oldValue,
    };

    reverseStack.push(reverseAction);
}

export function updateRepeatFormAction(action: FormRepeatUpdatedAction, reverseStack: UndoRedoAction[]): void {
    const { updateType } = action;
    
    switch(updateType) {
    case 'change':
        handleRepeatChangeAction(action as FormRepeatChangeAction, reverseStack);
        break;

    case 'add':
        handleRepeatAddAction(action as FormRepeatMutateAction, reverseStack);
        break;

    case 'remove':
        handleRepeatRemoveAction(action as FormRepeatMutateAction, reverseStack);
        break;

    case 'move':
        handleRepeatMoveAction(action as FormRepeatMoveAction, reverseStack);
        break;
    }
}

function handleRepeatChangeAction(action: FormRepeatChangeAction, reverseStack: UndoRedoAction[]): void {
    const { elementId, nodeId, formValueId, oldValue, newValue, index, repeatId } = action;

    updateRepeatElementValue(elementId, nodeId, formValueId, oldValue, index, repeatId);

    const reverseAction: FormRepeatChangeAction = {
        ...action,
        oldValue: newValue,
        newValue: oldValue,
    };
    
    reverseStack.push(reverseAction);
}

function handleRepeatAddAction(action: FormRepeatMutateAction, reverseStack: UndoRedoAction[]): void {
    const { elementId, nodeId, formValueId, index } = action;

    removeRepeatElement(elementId, nodeId, formValueId, index);
    
    const reverseAction: FormRepeatMutateAction = {
        ...action,
        updateType: 'remove',
    };
    
    reverseStack.push(reverseAction);
}

function handleRepeatRemoveAction(action: FormRepeatMutateAction, reverseStack: UndoRedoAction[]): void {
    const { elementId, nodeId, formValueId, value, index} = action;
    
    addRepeatElement(elementId, nodeId, formValueId, value, index);
    
    const reverseAction: FormRepeatMutateAction = {
        ...action,
        updateType: 'add',
    };
    reverseStack.push(reverseAction);
}

function handleRepeatMoveAction(action: FormRepeatMoveAction, reverseStack: UndoRedoAction[]): void {
    const { elementId, nodeId, formValueId, oldIndex, newIndex } = action;
    
    console.log('handling repeat move action');
    
    moveRepeatElement(elementId, nodeId, formValueId, oldIndex, newIndex);
    
    const reverseAction: FormRepeatMoveAction = {
        ...action,
        oldIndex: newIndex,
        newIndex: oldIndex,
    };
    
    reverseStack.push(reverseAction);
}


export function ignoreUndoRedoOnFocus(event: KeyboardEvent): void {
    const { key, ctrlKey, metaKey } = event;
    if(ctrlKey || metaKey) {
        if(key === 'z' || key === 'Z') {
            event.stopPropagation();
        }
        if(key === 'y' || key === 'Y') {
            event.stopPropagation();
        }
    }
}