import { defineStore } from 'pinia';
import { UndoRedoAction, NodeMovedAction, NodeMutatedAction, EdgeAction, EdgeUpdatedAction } from '../interfaces';
import { applyEdgeChanges, applyNodeChanges, getConnectedEdges, useVueFlow } from '@vue-flow/core';
import { toRaw } from 'vue';

const { findNode, addNodes, nodes, edges, addEdges, updateEdge } = useVueFlow({ id: 'main' });

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
            case 'edgeAdded':
                this.deleteEdge(action, reverseStack);
                break;
            case 'edgeUpdated':
                this.updateEdgeAction(action, reverseStack);
                break;
            case 'edgeRemoved':
                this.addEdge(action, reverseStack);
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

        deleteNode(action: NodeMutatedAction, reverseStack: UndoRedoAction[]): void {
            const node = JSON.parse(action.node);

            const reverseAction: NodeMutatedAction = {
                type: 'nodeRemoved',
                node: action.node,
                edges: getConnectedEdges([node], edges.value).map(edge => JSON.stringify(edge))
            };
            
            applyNodeChanges(
                [{ id: node.id, type: 'remove' }],
                nodes.value
            );
            reverseStack.push(reverseAction);
        },

        addNode(action: NodeMutatedAction, reverseStack: UndoRedoAction[]): void {
            const node = JSON.parse(action.node);
            addNodes([node]);

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
            
        },

        updateNode() {
            return;
        },

        addEdge(action: EdgeAction, reverseStack: UndoRedoAction[]): void {

            const edge = JSON.parse(action.edge);
            edge.data = {
                undoRedo: true
            };
            addEdges([edge]);
            console.log('adding edge');

            const reverseAction: EdgeAction = {
                type: 'edgeAdded',
                edge: action.edge
            };
            reverseStack.push(reverseAction);
        },

        updateEdgeAction(action: EdgeUpdatedAction, reverseStack: UndoRedoAction[]): void {            
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
        },

        deleteEdge(action: EdgeAction, reverseStack: UndoRedoAction[]): void {
            const edge = JSON.parse(action.edge);
            applyEdgeChanges([{ id: edge.id, type: 'remove' }], edges.value);

            const reverseAction: EdgeAction = {
                type: 'edgeRemoved',
                edge: action.edge
            };
            reverseStack.push(reverseAction);
        }
    }
});