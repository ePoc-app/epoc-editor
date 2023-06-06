import { UndoRedoAction } from '@/src/shared/interfaces';

export function formUpdated(action: UndoRedoAction, reverseStack: UndoRedoAction[]): void {
    const reverseAction: UndoRedoAction = {
        type: action.type,
    };
    reverseStack.push(reverseAction);
}

export function ignoreUndoRedoOnFocus(event): void {
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