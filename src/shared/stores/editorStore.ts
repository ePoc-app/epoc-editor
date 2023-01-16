import { defineStore } from 'pinia';
import { fetchRecentProjects } from '../services';
import { SideAction, Screen, ePocProject, NodeElement, Form } from '../interfaces';
import { toRaw } from 'vue';

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
    questions: SideAction[];
    standardScreens: Screen[];
    forms: Form[];
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
            openedElement: null,
            openedScreen: null
        },
        sideActions: actionItems,
        questions: questions,
        standardScreens: standardScreen,
        forms: forms,
        chapters: []
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
            // const { applyNodeChanges } = useVueFlow();
            // applyNodeChanges([
            //     {
            //         id: this.formPanel.openedElement.parentId,
            //         type: 'remove',
            //     }
            // ]);
            console.log(this.formPanel.openedElement.parentId);
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

const forms: Form[] = [
    {
        type: 'text',
        name: 'Contenu',
        icon: 'icon-texte',
        fields: [
            {
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
        fields: [
            {
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
                ]
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
                action: 'delete'
            }
        ]
    },
    {
        type: 'qcm',
        name: 'QCM',
        icon: 'icon-qcm',
        fields: [
            {
                name: 'Configuration de l\'activité',
                index: 1,
                inputs: [
                    {
                        type: 'text',
                        label: 'Titre',
                        value: '',
                        placeholder: 'Saisissez...'
                    },
                    {
                        type: 'textarea',
                        label: 'Énoncé',
                        value: '',
                        placeholder: 'Saisissez'
                    }
                ]
            },
            {
                name: 'Question',
                index: 2,
                inputs: [
                    {
                        type: 'textarea',
                        label: '',
                        value: '',
                        placeholder: 'Saisissez l\'intitulé de la question...'
                    }
                ]
            },
            {
                name: 'Réponses',
                index: 3,
                inputs: [
                    {
                        type: 'response',
                        label: '',
                        value: '',
                        placeholder: 'Saisissez une réponse...',
                        question: {
                            pos: 1,
                            type: 'check'
                        }
                    },
                    {
                        type: 'response',
                        label: '',
                        value: '',
                        placeholder: 'Saisissez une réponse...',
                        question: {
                            pos: 2,
                            type: 'check',
                            isLast: true,
                        }
                    },
                    {
                        type: 'add',
                        label: '',
                        value: '',
                        placeholder: 'Ajouter une autre réponse'
                    },
                ]
            },
            {
                name: 'Explication',
                index: 4,
                inputs: [
                    {
                        type: 'textarea',
                        label: '',
                        value: '',
                        placeholder: 'Saisissez une explication'
                    }
                ]
            }
        ]
    },
    {
        type: 'chapter',
        name: 'Chapitre',
        icon: 'icon-chapitre',
        fields: [
            {
                inputs: [
                    {
                        type: 'text',
                        label: 'Titre',
                        value: '',
                        placeholder: 'Saisissez...'
                    },
                ]
            },
            {
                name: 'Objectifs',
                inputs: [
                    {
                        type: 'response',
                        label: '',
                        value: '',
                        placeholder: 'Saisissez un objectif...',
                        question: {
                            pos: 1,
                            isLast: false
                        }
                    },
                    {
                        type: 'response',
                        label: '',
                        value: '',
                        placeholder: 'Saisissez un objectif...',
                        question: {
                            pos: 2,
                            isLast: true
                        }
                    },
                    {
                        type: 'add',
                        label: '',
                        value: '',
                        placeholder: 'Ajouter un autre objectif'
                    }
                ]
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
        type: 'epoc',
        name: 'Paramètre de l\'ePoc',
        icon: 'icon-epoc',
        fields: [
            {
                inputs :[
                    {
                        type: 'text',
                        label: 'Titre',
                        value: '',
                        placeholder: 'Saisissez...'
                    },
                    {
                        type: 'file',
                        label: 'Image de couverture',
                        value: '',
                        accept: 'image/*'
                    },
                    {
                        type: 'add',
                        label: 'Vignette',
                        value: '',
                        placeholder: 'Ajouter une vignette'
                    },
                    {
                        type: 'add',
                        label: 'Teaser',
                        value: '',
                        placeholder: 'Ajouter un teaser'
                    },
                    {
                        type: 'textarea',
                        label: 'Présentation',
                        value: '',
                        placeholder: 'Saisissez une présentation de l\'ePoc...'
                    },
                    {
                        type: 'text',
                        label: 'ID de l\'ePoc',
                        value: 'id234567890',
        
                    },
                    {
                        type: 'text',
                        label: 'Version',
                        value: '1.0',
                    }
                ]
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
    }
];