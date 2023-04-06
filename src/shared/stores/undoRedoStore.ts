import { defineStore } from 'pinia';
import { UndoRedoAction, NodeMovedAction, NodeRemovedAction, NodeAddedAction } from '../interfaces';
import { applyNodeChanges, useVueFlow } from '@vue-flow/core';

const { findNode, addNodes, nodes } = useVueFlow({ id: 'main' });

interface UndoRedoState {
    undoStack: UndoRedoAction[];
    redoStack: UndoRedoAction[];
}

export const useUndoRedoStore = defineStore('epoc', {
    state: (): UndoRedoState => ({
        undoStack: [],
        redoStack: [],
    }),

    actions: {
        undo(): void {
            if(this.undoStack.length === 0) return;

            const action = this.undoStack.pop();
            this.executeAction(action, this.redoStack);
        },
        redo(): void {
            if(this.redoStack.length === 0) return;

            const action = this.redoStack.pop();
            this.executeAction(action, this.undoStack);
        },
        addAction(action: UndoRedoAction): void {
            this.undoStack.push(action);
            this.redoStack = [];
        },
        executeAction(action: UndoRedoAction, reverseStack: UndoRedoAction[]): void {
            switch(action.type) {
            case 'nodeMoved':
                this.moveNode(action, reverseStack);
                break;
            case 'nodeRemoved':
                this.addNode(action, reverseStack);
                break;
            case 'nodeAdded':
                this.deleteNode(action, reverseStack);
                break;
            case 'nodeUpdated':
                this.updateNode(action);
                break;
            case 'edgeConnected':
                this.connectEdge(action);
                break;
            case 'edgeUpdated':
                this.updateEdge(action);
                break;
            case 'edgeRemoved':
                this.deleteEdge(action);
                break;
            }
        },
        moveNode(action: NodeMovedAction, reverseStack: UndoRedoAction[]): void {
            const node = findNode(action.nodeId);
            node.position.x -= action.deltaMovement.x;
            node.position.y -= action.deltaMovement.y;
            
            const reverseAction: NodeMovedAction = {
                type: 'nodeMoved',
                nodeId: action.nodeId,
                deltaMovement: {
                    x: -action.deltaMovement.x,
                    y: -action.deltaMovement.y
                }
            };
            reverseStack.push(reverseAction);
        },
        deleteNode(action: NodeRemovedAction, reverseStack: UndoRedoAction[]) {
            const node = JSON.parse(action.node);

            applyNodeChanges(
                [{ id: node.id, type: 'remove' }],
                nodes.value
            );

            const reverseAction: NodeRemovedAction = {
                type: 'nodeRemoved',
                node: action.node,
            };
            reverseStack.push(reverseAction);
        },
        addNode(action: NodeAddedAction, reverseStack: UndoRedoAction[]) {
            const node = JSON.parse(action.node);

            addNodes([node]);

            const reverseAction: NodeAddedAction = {
                type: 'nodeAdded',
                node: action.node,
            };
            reverseStack.push(reverseAction);
            
        },
        updateNode() {
            return;
        },
        connectEdge() {
            return;
        },
        updateEdge() {
            return;
        },
        deleteEdge() {
            return;
        }
    }
});