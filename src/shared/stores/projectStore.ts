import { defineStore } from 'pinia';
import { ePocProject } from '@/src/shared/interfaces';
import { openEPOC } from '@/src/shared/services';

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
        async openEPOC() {
            this.project = await openEPOC();
        }
    }
});