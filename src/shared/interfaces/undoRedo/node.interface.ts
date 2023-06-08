import { UndoRedoAction } from './undoRedoAction.interface';

export interface NodeMovedAction extends UndoRedoAction {
    type: 'nodeMoved';
    nodeId: string;
    deltaMovement: { x: number; y: number };
}

//? Is saving an entire node in this situation a good idea?
export interface NodeMutatedAction extends UndoRedoAction {
    type: 'nodeAdded' | 'nodeRemoved';
    //TODO: Not sure if better to stock json string or node object
    node: string;
    edges: string[];
}
export interface NodeUpdatedAction extends UndoRedoAction {
    type: 'nodeUpdated';
    node: string;
}