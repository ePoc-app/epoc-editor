import { defineStore } from 'pinia';
import { SideAction, Screen, ePocProject, Form, Card } from '@/src/shared/interfaces';
import { toRaw } from 'vue';
import { applyNodeChanges, useVueFlow, getConnectedEdges } from '@vue-flow/core';

import { formsModel } from '@/src/shared/data/form.data';

const { findNode, nodes, edges } = useVueFlow({ id: 'main' });

type uid = string;

interface EditorState {
    loading:boolean;
    recentProjects: ePocProject[];
    currentProject: ePocProject;
    saving: boolean;
    loadingPreview: boolean;
    exporting:boolean;
    floatingMenu: boolean;
    modelMenu: boolean;
    formPanel: Form;
    openedNodeId: uid | null;
    openedParentId: uid | null;
    // sideActions: SideAction[];
    questions: SideAction[];
    // standardScreens: Screen[];
    standardScreens: SideAction[];
    undoStack: [];
    redoStack: [];
}

export const useEditorStore = defineStore('editor', {
    state: (): EditorState => ({
        loading: false,
        recentProjects: [],
        currentProject: {filepath: null, workdir: null, name: null, modified: null},
        saving: false,
        loadingPreview: false,
        exporting: false,
        floatingMenu: false,
        modelMenu: false,
        formPanel: null,
        openedNodeId: null,
        openedParentId: null,
        // sideActions: actionItems,
        questions: questions,
        standardScreens: standardScreen,
        undoStack: [],
        redoStack: [],
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
            this.openedNodeId = id;
            this.openedParentId = parentId;
            this.formPanel = null;
            //? To be sure the view is notified of closing / reopening
            setTimeout(() => [
                this.formPanel = form
            ]);
        },
        closeFormPanel(): void {
            this.formPanel = null;
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
        deleteElement(id: string): void {
            
            const nodeToDelete = findNode(id);

            if(!nodeToDelete){
                const parentNode = findNode(this.openedParentId);
                parentNode.data.elements.forEach((value, index) => {
                    if(value.id === id) {
                        this.removeElementFromScreen(index, this.openedParentId);
                    }
                });
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
                }
            }
            this.closeFormPanel();
        },
        addCard(type: string, fieldIndex: number): void {
            const newCard: Card = this.getCard(type);
            this.formPanel.fields[fieldIndex].inputs.push(newCard);
        },
        addElementToScreen(form: Form, action: SideAction, index: number): void {
            const newCard: Card = this.getCard('component');
            newCard.action = action;
            if(index !== -1) {
                form.fields[1].inputs.splice(index, 0, newCard);
            } else {
                form.fields[1].inputs.push(newCard);
            }
        },
        removeElementFromScreen(index: number, parentNodeId): void {
            const node = findNode(parentNodeId);

            node.data.elements.splice(index, 1);
            node.data.form.fields[1].inputs.splice(index, 1);
            if(node.data.elements.length === 0) {
                const connectedEdges = getConnectedEdges([node], edges.value);
                connectedEdges.forEach(edge => {
                    const source = findNode(edge.source);
                    const target = findNode(edge.target);
                    source.data.isSource = false;
                    target.data.isTarget = false;
                });
                this.deleteElement(parentNodeId);
            }
        },
        changeElementOrder(startIndex: number, finalIndex: number, parentNodeId: string): void {
            const node = findNode(parentNodeId);
            const tmp = node.data.elements[startIndex];

            node.data.elements.splice(startIndex, 1);
            node.data.elements.splice(finalIndex, 0, tmp);
        },
        undo() {
            // @todo
            console.log('todo undo', this.undoStack.length);
        },
        redo() {
            // @todo
            console.log('todo redo');
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

const standardScreen: SideAction[] = [
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
        icon: 'icon-question',
        type: 'question',
        label: 'Question'
    },
];

// const standardScreen: Screen[] = [
//     {
//         title: 'Ecran texte',
//         actions: [
//             {
//                 icon: 'icon-texte',
//                 type: 'text',
//                 label: 'Texte'
//             }
//         ]
//     },
//     {
//         title: 'Ecran video',
//         actions: [
//             {
//                 icon: 'icon-video',
//                 type: 'video',
//                 label: 'Vidéo'
//             },
//             {
//                 icon: 'icon-texte',
//                 type: 'text',
//                 label: 'Texte'
//             }
//         ]
//     },
//     {
//         title: 'Ecran audio',
//         actions: [
//             {
//                 icon: 'icon-audio',
//                 type: 'audio',
//                 label: 'Audio'
//             },
//             {
//                 icon: 'icon-texte',
//                 type: 'text',
//                 label: 'Texte'
//             }
//         ]
//     }
// ];


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
