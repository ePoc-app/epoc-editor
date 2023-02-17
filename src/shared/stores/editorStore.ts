import { defineStore } from 'pinia';
import { SideAction, Screen, ePocRecentProject, NodeElement, Form, Card, ePocProject } from '@/src/shared/interfaces';
import { toRaw } from 'vue';
import { applyNodeChanges, useVueFlow } from '@vue-flow/core';

import { formsModel } from '@/src/shared/data/form.data';

const { findNode, nodes } = useVueFlow({ id: 'main' });

type uid = string;

interface EditorState {
    loading:boolean;
    recentProjects: ePocRecentProject[];
    currentProject: ePocProject;
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
        loading: false,
        recentProjects: [],
        currentProject: {filepath: null, workdir: null},
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
            
            const nodeToDelete = this.openedParentId ? findNode(this.openedParentId) : findNode(this.openedNodeId);

            if(this.openedParentId && nodeToDelete.data.type === 'question' && nodeToDelete.data.elements.length > 1) {
                for(const i in nodeToDelete.data.elements) {
                    if(nodeToDelete.data.elements[i].id === this.openedNodeId) {
                        this.removeElementFromScreen(Number(i));
                    }
                }
            } else {
                applyNodeChanges(
                    [{ id: nodeToDelete.id, type: 'remove' }],
                    nodes.value
                );
                if(nodeToDelete.type === 'chapter') {
                    const chapters = nodes.value.filter(node => node.type === 'chapter');
                    for(const chapter of chapters) {
                        if(chapter.id > nodeToDelete.id) {
                            chapter.position = {x: 0, y: chapter.position.y - 200};
                            chapter.data.title = 'Chapitre ' + (Number(chapter.data.title.split(' ')[1]) - 1);
                        }
                    }
                    findNode('2').position.y -= 200;
                    this.chapters.splice(this.chapters.findIndex(chapter => chapter.id === nodeToDelete.id), 1);
                }
            }



            this.closeFormPanel();
        },
        addCard(type: string, fieldIndex: number): void {
            const newCard: Card = this.getCard(type);
            this.formPanel.form.fields[fieldIndex].inputs.push(newCard);
        },
        addElementToScreen(form: Form, action: SideAction): void {
            const newCard: Card = this.getCard('component');
            newCard.action = action;
            form.fields[1].inputs.push(newCard);
        },
        removeElementFromScreen(index: number): void {
            const node = this.openedParentId ? findNode(this.openedParentId) : findNode(this.openedNodeId);
            node.data.elements.splice(index, 1);
            if(node.data.elements.length === 0) {
                this.deleteCurrentElement();
            }
        },
        changeElementOrder(startIndex: number, finalIndex: number): void {
            const node = findNode(this.openedNodeId);
            const tmp = node.data.elements[startIndex];
            node.data.elements[startIndex] = node.data.elements[finalIndex];
            node.data.elements[finalIndex] = tmp;
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
        ],
    },
    {
        type: 'component',
        label: 'Composant',
        placeholder: 'Ajouter un composant',
        inputs: [],
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
                type: 'text',
                label: 'Texte'
            }
        ]
    },
    {
        title: 'Ecran video',
        actions: [
            {
                icon: 'icon-video',
                type: 'video',
                label: 'Vidéo'
            },
            {
                icon: 'icon-texte',
                type: 'text',
                label: 'Texte'
            }
        ]
    },
    {
        title: 'Ecran audio',
        actions: [
            {
                icon: 'icon-audio',
                type: 'audio',
                label: 'Audio'
            },
            {
                icon: 'icon-texte',
                type: 'text',
                label: 'Texte'
            }
        ]
    }
];


const actionItems: SideAction[] = [
    {
        icon: 'icon-texte',
        type: 'text',
        label: 'Texte'
        
    },
    {
        icon: 'icon-video',
        type: 'video',
        label: 'Vidéo'
    },
    {
        icon: 'icon-audio',
        type: 'audio',
        label: 'Audio'
    },
    {
        icon: 'icon-question',
        type: 'question',
        label: 'Question'
    },
    {
        icon: 'icon-condition',
        type: 'condition',
        label: 'Condition'
    },
    {
        icon: 'icon-javascript',
        type: 'javascript',
        label: 'Javascript'
    },
    {
        icon: 'icon-modele',
        type: 'model',
        label: 'Modèle'
    }
];

const questions: SideAction[] = [
    {
        icon: 'icon-qcm',
        type: 'qcm',
        label: 'QCM'
    },
    {
        icon: 'icon-dragdrop',
        type: 'dragdrop',
        label: 'Drag & Drop'
    },
    {
        icon: 'icon-reorder',
        type: 'reorder',
        label: 'Reorder'
    },
    {
        icon: 'icon-swipe',
        type: 'swipe',
        label: 'Swipe'
    },
    {
        icon: 'icon-liste',
        type: 'list',
        label: 'Liste déroulantes'
    }
];
