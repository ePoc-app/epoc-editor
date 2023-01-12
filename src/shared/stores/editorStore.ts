import { defineStore } from 'pinia';
import { fetchRecentProjects } from '../services';
import { SideAction, Screen, ePocProject, NodeElement, Form } from '../interfaces';
import { toRaw } from 'vue';
import { GraphNode, NodeChange, applyNodeChanges, useVueFlow } from '@vue-flow/core';

interface EditorState {
    recentProjects: ePocProject[];
    floatingMenu: boolean;
    modelMenu: boolean;
    formPanel: {
        isOpen: boolean;
        form: Form;
        openedElement: NodeElement;
        openedScreen: Screen;
    };
    sideActions: SideAction[];
    subSideActions: SideAction[];
    standardScreens: Screen[];
    forms: Form[];
}

export const useEditorStore = defineStore('editor', {
    state: (): EditorState => ({
        recentProjects: [],
        floatingMenu: false,
        modelMenu: false,
        formPanel: {
            isOpen: false,
            form: null,
            openedElement: null,
            openedScreen: null
        },
        sideActions: actionItems,
        subSideActions: subActions,
        standardScreens: standardScreen,
        forms: forms,
    }),
    
    getters: {
        //* These getters are used to place the separator
        getSideActionsFirstPart() {
            return this.sideActions.slice(0, -1);
        },
        getSideActionsLastPart() {
            return this.sideActions.slice(-1);
        },
        //This function is a part of the one used in ePocStore
        getSelectedScreens() {
            return this.standardScreens;
        },
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
            this.modelMenu = false;
        },
        openFormPanel(element: NodeElement) {
            this.formPanel.isOpen = true;
            this.formPanel.form = element.form;
            this.formPanel.openedElement = element;
        },
        closeFormPanel() {
            this.formPanel.isOpen = false;
            this.formPanel.form = null;
            this.formPanel.openedElement = null;
        },
        //generate id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
        generateId() {
            const s4 = () => {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            };
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        },
        //return a copy of the form linked to the type
        getForm(type: string) {
            return structuredClone(toRaw(this.forms.find(form => form.type === type)));
        },
        deleteCurrentElement() {
            const { nodes } = useVueFlow();
            const node = nodes[this.formPanel.openedElement.id - 1];
            const changes: NodeChange[] = [{ id: node.id, type: 'remove' }];
            applyNodeChanges(changes, nodes.value);
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

const subActions: SideAction[] = [
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

const forms: Form[] = [
    {
        type: 'text',
        name: 'Contenu',
        icon: 'icon-texte',
        inputs: [
            {
                type: 'text',
                label: 'Titre',
                value: '',
                placeholder: 'Saisissez...'
            },
            {
                type: 'textarea',
                label: 'Résumé',
                value: '',
                placeholder: 'Saisissez un résumé...'
            },
            {
                type: 'file',
                label: 'Vignette',
                value: '',
                accept: 'image/*'
            }
        ],
        buttons: [
            {
                label: 'Supprimer',
                icon: 'icon-supprimer',
                action: 'delete'
            },
            {
                label: 'Copier le lien',
                icon: 'icon-copie',
                action: 'copy'
            },
        ]
    },
    {
        type: 'video',
        name: 'Vidéo',
        icon: 'icon-video',
        inputs: [
            {
                type: 'text',
                label: 'Titre',
                value: '',
                placeholder: 'Saisissez...'
            },
            {
                type: 'file',
                label: 'Vidéo',
                value: '',
                accept: 'video/*'
            },
            {
                type: 'textarea',
                label: 'Résumé',
                value: '',
                placeholder: 'Saisissez un résumé...'
            },
            {
                type: 'add',
                label: 'Transcription',
                value: '',
                placeholder: 'Ajouter une transcription'
            },
            {
                type: 'add',
                label: 'Vignette',
                value: '',
                placeholder: 'Ajouter une vignette'
            },
            {
                type: 'add',
                label: 'Sous-titres',
                value: '',
                placeholder: 'Ajouter des sous-titres'
            },
        ],
        buttons: [
            {
                label: 'Supprimer',
                icon: 'icon-supprimer',
                action: 'delete'
            },
            {
                label: 'Copier le lien',
                icon: 'icon-copie',
                action: 'delete'
            }
        ]
    }
];