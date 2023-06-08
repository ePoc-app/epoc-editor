import { UndoRedoAction } from './undoRedoAction.interface';

export interface FormUpdatedAction extends UndoRedoAction {
    type: 'formUpdated';
    nodeId: string;
    elementId: string;
    formValueId: string;
    oldValue: string | boolean;
    newValue: string | boolean;
}

export interface FormRepeatUpdatedAction extends UndoRedoAction {
    type: 'formRepeatUpdated';
    nodeId: string;
    elementId: string;
    formValueId: string;
    updateType: 'change' | 'add' | 'remove' | 'move';
}

export interface FormRepeatChangeAction extends FormRepeatUpdatedAction {
    updateType: 'change'; 
    oldValue: string;
    newValue: string;
    index: number;
    repeatId: string;
}

export interface FormRepeatMutateAction extends FormRepeatUpdatedAction {
    updateType: 'add' | 'remove';
    value: any;
    index: number;
}

export interface FormRepeatMoveAction extends FormRepeatUpdatedAction {
    updateType: 'move';
    oldIndex: number;
    newIndex: number;
}
