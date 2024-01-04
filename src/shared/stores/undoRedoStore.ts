import { defineStore } from 'pinia';
import { revertToState } from '../services/undoRedo.service';
import { graphService } from '@/src/shared/services';

interface UndoRedoState {
    undoStack: string[];
    redoStack: string[];
}

export const useUndoRedoStore = defineStore('undoRedo', {
    state: (): UndoRedoState => ({
        undoStack: [],
        redoStack: [],
    }),

    actions: {
        undo(): void {
            if (this.undoStack.length === 0) return;

            const state = this.undoStack.pop();

            const currentState = revertToState(state);

            this.redoStack.push(currentState);
        },

        redo(): void {
            if (this.redoStack.length === 0) return;

            const state = this.redoStack.pop();

            const currentState = revertToState(state);

            this.undoStack.push(currentState);
        },

        addState(state: string): void {
            this.undoStack.push(state);
            this.redoStack = [];

            if (this.undoStack.length > 100) this.undoStack.shift();
            graphService.writeProjectData();
        },

        reset(): void {
            this.undoStack = [];
            this.redoStack = [];
        },
    },
});
