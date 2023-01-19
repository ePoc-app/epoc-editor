import { defineStore } from 'pinia';
import { fetchRecentProjects } from '../services';
import { SideAction, Screen, ePocProject, NodeElement, Form, Input } from '../interfaces';
import { toRaw } from 'vue';

import { formsModel } from '../data/form.data';

type uid = string;

interface EditorState {
    recentProjects: ePocProject[];
    floatingMenu: boolean;
    modelMenu: boolean;
    formPanel: {
        isOpen: boolean;
        form: Form;
    };
    openedNodeId: uid | null;
    sideActions: SideAction[];
    questions: SideAction[];
    standardScreens: Screen[];
    chapters: NodeElement[];
}

export const useEditorStore = defineStore('editor', {
    state: (): EditorState => ({
        recentProjects: [],
        floatingMenu: false,
        modelMenu: false,
        formPanel: {
            isOpen: false,
            form: null,
        },
        openedNodeId: null,
        sideActions: actionItems,
        questions: questions,
        standardScreens: standardScreen,
        chapters: []
    }),
    
    getters: {
        //* These getters are used to place the separator
        getSideActionsFirstPart(): SideAction[] {
            return this.sideActions.slice(0, -1);
        },
        getSideActionsLastPart(): SideAction[] {
            return this.sideActions.slice(-1);
        },
        //This function is a part of the one used in ePocStore
        getSelectedScreens(): Screen[] {
            return this.standardScreens;
        },
    },
    
    actions: {
        async fetchRecentProjects(): Promise<void> {
            this.isLoading = true;
            // ? recentProjects is a proxy is it a problem ?
            this.recentProjects = await fetchRecentProjects();
            this.isLoading = false;
        },
        dismissModals(): void {
            this.floatingMenu = false;
            this.modelMenu = false;
        },
        openFormPanel(id: string, form: Form): void {
            this.formPanel.isOpen = true;
            this.formPanel.form = form;
            this.openedNodeId = id;
        },
        closeFormPanel(): void {
            this.formPanel.isOpen = false;
            this.formPanel.form = null;
            this.openedNodeId = null;
        },
        //generate id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
        generateId(): uid {
            const s4 = () => {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            };
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        },
        //return a copy of the form linked to the type
        getForm(type: string): Form {
            return structuredClone(toRaw(formsModel.find(form => form.type === type)));
        },
        deleteCurrentElement(): void {
            // const { applyNodeChanges } = useVueFlow();
            // applyNodeChanges([
            //     {
            //         id: this.formPanel.openedElement.parentId,
            //         type: 'remove',
            //     }
            // ]);
            console.log(this.openedNodeId);
        },
        addInput(type: string, fieldIndex: number):void {
            const newInput: Input = {
                type: type,
                label: '',
                placeholder: '',
                value: '',
                assessment: {
                    isChecked: false,
                    selectedOption: '',
                    selectedRadio: 0
                }
            };
            this.formPanel.form.fields[fieldIndex].inputs.push(newInput);
        }
    }
});

const standardScreen: Screen[] = [
    {
        title: 'Ecran texte',
        actions: [
            {
                icon: 'icon-texte',
                type: 'text'
            }
        ]
    },
    {
        title: 'Ecran video',
        actions: [
            {
                icon: 'icon-video',
                type: 'video'
            },
            {
                icon: 'icon-texte',
                type: 'text'
            }
        ]
    },
    {
        title: 'Ecran audio',
        actions: [
            {
                icon: 'icon-audio',
                type: 'audio'
            },
            {
                icon: 'icon-texte',
                type: 'text'
            }
        ]
    }
];


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

const questions: SideAction[] = [
    {
        icon: 'icon-qcm',
        type: 'qcm'
    },
    {
        icon: 'icon-dragdrop',
        type: 'dragdrop'
    },
    {
        icon: 'icon-reorder',
        type: 'reorder'
    },
    {
        icon: 'icon-swipe',
        type: 'swipe'
    },
    {
        icon: 'icon-liste',
        type: 'list'
    }
];