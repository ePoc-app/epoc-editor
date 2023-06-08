import { defineStore } from 'pinia';
import { UndoRedoAction, NodeMovedAction, NodeMutatedAction, EdgeUpdatedAction, EdgeMutatedAction, FormUpdatedAction, FormRepeatChangeAction, ContentMutatedAction, ContentMovedAction } from '../../interfaces';
import { addEdgeAction, addNodeAction, deleteEdgeAction, deleteNodeAction, updateFormAction, moveNodeAction, updateEdgeAction, updateNodeAction, updateRepeatFormAction, addContentAction, removeContentAction, moveContentAction } from './functions';

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
            //TODO: See if this is necessary
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
                updateFormAction(action as FormUpdatedAction, reverseStack);
                break;
            case 'formRepeatUpdated':
                updateRepeatFormAction(action as FormRepeatChangeAction, reverseStack);
                break;
            case 'contentAdded':
                removeContentAction(action as ContentMutatedAction, reverseStack);
                break;
            case 'contentRemoved':
                addContentAction(action as ContentMutatedAction, reverseStack);
                break;
            case 'contentMoved':
                moveContentAction(action as ContentMovedAction, reverseStack);
                break;
            }
        },
    }
});