import { FormRepeatChangeAction, FormUpdatedAction, UndoRedoAction } from '@/src/shared/interfaces';
import { updateElementValue, updateRepeatElementValue } from '@/src/shared/services/graph';

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

export function updateRepeatFormAction(action: FormRepeatChangeAction, reverseStack: UndoRedoAction[]): void {
    const { elementId, nodeId, formValueId, oldValue, newValue, index, repeatId } = action;

    updateRepeatElementValue(elementId, nodeId, formValueId, oldValue, index, repeatId);

    const reverseAction: FormRepeatChangeAction = {
        ...action,
        oldValue: newValue,
        newValue: oldValue,
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