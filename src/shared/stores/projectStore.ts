import { defineStore } from 'pinia';

interface ProjectState {
    nodes: string[];
}

export const useProjectStore = defineStore('project', {
    state: (): ProjectState => ({
        nodes: [],
        
    }),
    actions: {
    }
});