import { GraphEdge } from '@vue-flow/core';
import { UndoRedoAction } from './undoRedoAction.interface';

export interface EdgeMutatedAction extends UndoRedoAction {
    type: 'edgeAdded' | 'edgeRemoved';
    edge: string;
}

export interface EdgeUpdatedAction extends UndoRedoAction {
    type: 'edgeUpdated';
    newEdge: GraphEdge;
    oldEdge: GraphEdge
}