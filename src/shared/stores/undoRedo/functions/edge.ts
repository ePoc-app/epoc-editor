import { EdgeMutatedAction, EdgeUpdatedAction, UndoRedoAction } from '@/src/shared/interfaces';
import { applyEdgeChanges, useVueFlow } from '@vue-flow/core';

const { edges, addEdges, updateEdge } = useVueFlow({ id: 'main' });

export function addEdgeAction(action: EdgeMutatedAction, reverseStack: UndoRedoAction[]): void {
    const edge = JSON.parse(action.edge);
    edge.data = {
        undoRedo: true
    };

    addEdges([edge]);

    const reverseAction: EdgeMutatedAction = {
        type: 'edgeAdded',
        edge: action.edge
    };
    reverseStack.push(reverseAction);
}

export function updateEdgeAction(action: EdgeUpdatedAction, reverseStack: UndoRedoAction[]): void {            
    const { newEdge, oldEdge } = action; 

    const reverseNewEdge = updateEdge(newEdge, {
        source: oldEdge.source,
        target: oldEdge.target
    }, false);

    if(!reverseNewEdge) return;
    
    const reverseAction: EdgeUpdatedAction = {
        type: 'edgeUpdated',
        newEdge: reverseNewEdge,
        oldEdge: newEdge
    };
    reverseStack.push(reverseAction);
}

export function deleteEdgeAction(action: EdgeMutatedAction, reverseStack: UndoRedoAction[]): void {
    const edge = JSON.parse(action.edge);
    applyEdgeChanges([{ id: edge.id, type: 'remove' }], edges.value);

    const reverseAction: EdgeMutatedAction = {
        type: 'edgeRemoved',
        edge: action.edge
    };
    reverseStack.push(reverseAction);
}