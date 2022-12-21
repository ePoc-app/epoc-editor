import { defineStore } from 'pinia';
import { ePocProject } from '../interfaces';
import { fetchRecentProjects } from '../services';
import { SideAction } from '../interfaces';


interface EditorState {
    recentProjects: ePocProject[];
    floatingMenu: boolean;
    sideActions: SideAction[];
    subSideActions: SideAction[];
}

export const useEditorStore = defineStore('editor', {
    state: (): EditorState => ({
        recentProjects: [],
        floatingMenu: false,
        sideActions: actionItems,
        subSideActions: subActions
    }),
    
    getters: {
        //* These getters are used to place the separator
        getSideActionsFirstPart() {
            return this.sideActions.slice(0, -1);
        },
        getSideActionsLastPart() {
            return this.sideActions.slice(-1);
        }
    },
    
    actions: {
        async fetchRecentProjects() {
            this.isLoading = true;
            // ? recentProjects is a proxy is it a problem ?
            this.recentProjects = await fetchRecentProjects();
            this.isLoading = false;
        },
        dismissModals() {
            this.floatingMenu = false;
        }
    }
});


const actionItems: SideAction[] = [
    {
        icon: 'icon-texte',
        type: 'text'
    },
    {
        icon: 'icon-video',
        type: 'video'
    },
    {
        icon: 'icon-audio',
        type: 'audio'
    },
    {
        icon: 'icon-question',
        type: 'question'
    },
    {
        icon: 'icon-condition',
        type: 'condition'
    },
    {
        icon: 'icon-javascript',
        type: 'javascript'
    },
    {
        icon: 'icon-modele',
        type: 'model'
    }
];

const subActions = [
    {
        icon: 'icon-qcm',
    },
    {
        icon: 'icon-dragdrop',
    },
    {
        icon: 'icon-reorder',
    },
    {
        icon: 'icon-swipe'
    },
    {
        icon: 'icon-liste'
    }
];