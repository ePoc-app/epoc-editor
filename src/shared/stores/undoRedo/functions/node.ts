import { NodeMovedAction, NodeMutatedAction, UndoRedoAction } from '@/src/shared/interfaces';
import { useVueFlow, getConnectedEdges } from '@vue-flow/core';
import { createNodeFromJSON, deleteNode, moveNode } from '@/src/shared/services/graph';
import { toRaw } from 'vue';

const { edges, addEdges } = useVueFlow({ id: 'main' });

export function deleteNodeAction(action: NodeMutatedAction, reverseStack: UndoRedoAction[]): void {
    const node = JSON.parse(action.node);

    const reverseAction: NodeMutatedAction = {
        type: 'nodeRemoved',
        node: action.node,
        edges: getConnectedEdges([node], edges.value).map(edge => JSON.stringify(edge))
    };

    deleteNode(node.id, true);
    
    reverseStack.push(reverseAction);
}

export function addNodeAction(action: NodeMutatedAction, reverseStack: UndoRedoAction[]): void {
    createNodeFromJSON(action.node);

    const edges = [];
    const rawEdges = toRaw(action.edges);

    rawEdges.forEach((value) => {
        edges.push(JSON.parse(value));
    });

    if(edges.length > 0) {
        addEdges(edges);
    }

    const reverseAction: NodeMutatedAction = {
        type: 'nodeAdded',
        node: action.node,
        edges: action.edges
    };
    reverseStack.push(reverseAction);
}

export function updateNodeAction(): void {
    return;
}

export function moveNodeAction(action: NodeMovedAction, reverseStack: UndoRedoAction[]): void {
    const { nodeId, deltaMovement } = action;

    if(deltaMovement.x === 0 && deltaMovement.y === 0) return;            

    moveNode(action.nodeId, action.deltaMovement);
    
    const reverseAction: NodeMovedAction = {
        type: 'nodeMoved',
        nodeId: nodeId,
        deltaMovement: {
            x: - deltaMovement.x,
            y: - deltaMovement.y
        }
    };
    reverseStack.push(reverseAction);
}