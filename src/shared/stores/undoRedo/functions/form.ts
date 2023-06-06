import { UndoRedoAction } from '@/src/shared/interfaces';

export function formUpdated(action: UndoRedoAction, reverseStack: UndoRedoAction[]): void {
    const reverseAction: UndoRedoAction = {
        type: action.type,
    };
    reverseStack.push(reverseAction);
}