import { defineStore } from 'pinia';
import { ePocProject } from '../interfaces';
import { openEPOC } from '../services';

interface ProjectState {
    project: ePocProject;
    nodes: string[];
    //? Is it a good idea to have a floating menu state here  and not in the editor store ?
    floatingMenu: boolean;
}

export const useProjectStore = defineStore('project', {
    state: (): ProjectState => ({
        project: {
            name: '',
            modified: ''
        },
        nodes: [],
        floatingMenu: false
    }),
    actions: {
        async openEPOC() {
            this.project = await openEPOC();
        }
    }
});