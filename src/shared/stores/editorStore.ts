import { defineStore } from 'pinia';
import { fetchRecentProjects } from '@/src/shared/services';
import { SideAction, Screen, ePocProject, NodeElement, Form, Card } from '@/src/shared/interfaces';
import { toRaw } from 'vue';
import { useVueFlow } from '@vue-flow/core';

import { formsModel } from '@/src/shared/data/form.data';

const { findNode } = useVueFlow();

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
    openedParentId: uid | null;
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
        openedParentId: null,
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
        openFormPanel(id: string, form: Form, parentId?: string): void {
            this.formPanel.isOpen = true;
            this.formPanel.form = form;
            this.openedNodeId = id;
            this.openedParentId = parentId;
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
        getCard(type: string): Card {
            return structuredClone(toRaw(cardsModel.find(card => card.type === type)));
        },
        deleteCurrentElement(): void {
            // const { applyNodeChanges } = useVueFlow();
            // applyNodeChanges([
            //     {
            //         id: this.formPanel.openedElement.parentId,
            //         type: 'remove',
            //     }
            // ]);
            console.log('deleteCurrentElement', this.openedParentId);
            const node = findNode(this.openedParentId);
            console.log('node', node);
            this.closeFormPanel();
        },
        addCard(type: string, fieldIndex: number):void {
            const newCard: Card = this.getCard(type);
            this.formPanel.form.fields[fieldIndex].inputs.push(newCard);
        }
    }
});

const cardsModel: Card[] = [
    {
        type: 'objective',
        label: 'Objectif',
        placeholder: 'Ajouter un objectif',
        inputs: [
            {
                type:'textarea',
                label: '',
                placeholder: 'Saisissez un objectif...',
                value: ''
            }
        ]
    },
    {
        type: 'qcm',
        label: 'Réponse',
        placeholder: 'Ajouter une autre réponse',
        inputs: [
            {
                type:'textarea',
                label: '',
                placeholder: 'Saisissez une réponse...',
                value: ''
            },
            {
                type: 'checkbox',
                label: 'C\'est une bonne réponse',
                value: 'false'
            }
        ]
    },
    {
        type: 'category',
        label: 'Catégorie',
        placeholder: 'Ajouter une autre catégorie',
        inputs: [
            {
                type: 'textarea',
                label: '',
                placeholder: 'Saisissez un intitulé de catégorie...',
                value: ''
            },
        ]
    },
    {
        type: 'dd',
        label: 'Réponse',
        placeholder: 'Ajouter une autre réponse proposée',
        inputs: [
            {
                type: 'textarea',
                label: '',
                placeholder: 'Saisissez une réponse...',
                value: ''
            },
            {
                type: 'select',
                label: 'À quelle catégorie appartient cette réponse',
                placeholder: 'Catégorie',
                value: '',
            }
        ]
    },
    {
        type: 'reorder',
        label: 'Réponse',
        placeholder: 'Ajouter une autre réponse',
        inputs: [
            {
                type: 'textarea',
                label: '',
                placeholder: 'Saisissez une réponse...',
                value: ''
            },
            {
                type: 'select',
                label: 'Position affichée à l\'écran avant réorganisation',
                placeholder: 'Affichée en position',
                value: '',
            },
        ]
    },
    {
        type: 'swipe',
        label: 'Carte',
        placeholder: 'Ajouter une autre carte',
        inputs: [
            {
                type: 'textarea',
                label: '',
                placeholder: 'Saisissez une proposition...',
                value: ''
            },
            {
                type: 'radio-group',
                label: 'Réponse',
                value: '0'
            },
        ]
    },
    {
        type: 'list-choice',
        label: 'Choix',
        placeholder: 'Ajouter un autre choix',
        inputs: [
            {
                type: 'text',
                label: '',
                placeholder: 'Saisissez un choix...',
                value: ''
            },
        ]
    },
    {
        type: 'list',
        label: 'Carte',
        placeholder: 'Ajouter une autre carte',
        inputs: [
            {
                type: 'textarea',
                label: '',
                placeholder: 'Saisissez une question...',
                value: ''
            },
            {
                type: 'select',
                label: 'Réponse',
                placeholder: 'Choix',
                value: '',
            }
        ]
    }
];

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