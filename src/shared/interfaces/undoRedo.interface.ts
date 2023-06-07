import { GraphEdge } from '@vue-flow/core';

export interface UndoRedoAction {
    type: 'nodeMoved' | 'nodeAdded' | 'nodeRemoved' | 'nodeUpdated' |
        'edgeAdded' | 'edgeUpdated' | 'edgeRemoved' | 'formUpdated' | 
        'formRepeatUpdated' | 'formRepeatUpdated';
}

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

export interface EdgeMutatedAction extends UndoRedoAction {
    type: 'edgeAdded' | 'edgeRemoved';
    edge: string;
}

export interface EdgeUpdatedAction extends UndoRedoAction {
    type: 'edgeUpdated';
    newEdge: GraphEdge;
    oldEdge: GraphEdge
}

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
