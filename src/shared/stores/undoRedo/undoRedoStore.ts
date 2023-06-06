import { defineStore } from 'pinia';
import { UndoRedoAction, NodeMovedAction, NodeMutatedAction, EdgeUpdatedAction, EdgeMutatedAction, FormUpdatedAction } from '../../interfaces';
import { addEdgeAction, addNodeAction, deleteEdgeAction, deleteNodeAction, formUpdatedAction, moveNodeAction, updateEdgeAction, updateNodeAction } from './functions';

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
                moveNodeAction(action as NodeMovedAction, reverseStack);
                break;
            case 'nodeRemoved':
                addNodeAction(action as NodeMutatedAction, reverseStack);
                break;
            case 'nodeAdded':
                deleteNodeAction(action as NodeMutatedAction, reverseStack);
                break;
            case 'nodeUpdated':
                updateNodeAction();
                break;
            case 'edgeAdded':
                deleteEdgeAction(action as EdgeMutatedAction, reverseStack);
                break;
            case 'edgeUpdated':
                updateEdgeAction(action as EdgeUpdatedAction, reverseStack);
                break;
            case 'edgeRemoved':
                addEdgeAction(action as EdgeMutatedAction, reverseStack);
                break;
            case 'formUpdated':
                formUpdatedAction(action as FormUpdatedAction, reverseStack);
                break;
            }
        },
    }
});