import { defineStore } from 'pinia';
import { ePocProject } from '@/src/shared/interfaces';

interface ProjectState {
    project: ePocProject;
    nodes: string[];
}

export const useProjectStore = defineStore('project', {
    state: (): ProjectState => ({
        project: {
            name: '',
            modified: ''
        },
        nodes: [],
        
    }),
    actions: {
    }
});