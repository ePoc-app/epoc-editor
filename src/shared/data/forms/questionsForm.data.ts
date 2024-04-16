import { Form } from '@/src/shared/interfaces';
import { contentButtons } from './formButtons.data';

export const qcmForm: Form = {
    type: 'choice',
    name: 'QCM',
    icon: 'icon-qcm',
    displayFieldIndex: true,
    buttons: contentButtons,
    fields: [
        {
            name: "Configuration de l'activité",
            inputs: [
                {
                    id: 'score',
                    type: 'score',
                    label: 'Score',
                    value: 0,
                },
            ],
        },
        {
            name: 'Question',
            inputs: [
                {
                    id: 'label',
                    type: 'textarea',
                    label: 'Question',
                    value: '',
                    placeholder: 'Posez la question',
                },
                {
                    id: 'statement',
                    type: 'textarea',
                    label: 'Consigne',
                    value: '',
                    placeholder: 'Instruction pour répondre à la question',
                },
            ],
        },
        {
            name: 'Réponses',
            inputs: [
                {
                    id: 'responses',
                    label: 'Réponse',
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: 'label',
                            type: 'textarea',
                            label: '',
                            placeholder: 'Saisissez une réponse ..',
                            value: '',
                        },
                        {
                            id: 'value',
                            type: 'hidden',
                            label: '',
                            placeholder: 'Valeur cachée',
                            value: '',
                        },
                        {
                            id: 'isCorrect',
                            type: 'checkbox',
                            label: 'Bonne réponse',
                            value: false,
                        },
                    ],
                },
            ],
        },
        {
            name: 'Explication',
            inputs: [
                {
                    id: 'explanation',
                    type: 'html',
                    label: '',
                    value: '',
                    placeholder: 'Saisissez une explication',
                },
            ],
        },
    ],
};

export const dragDropForm: Form = {
    type: 'drag-and-drop',
    name: 'Drag & Drop',
    icon: 'icon-dragdrop',
    displayFieldIndex: true,
    buttons: contentButtons,
    fields: [
        {
            name: "Configuration de l'activité",
            inputs: [
                {
                    id: 'score',
                    type: 'score',
                    label: 'Score',
                    value: 0,
                },
            ],
        },
        {
            name: 'Question',
            inputs: [
                {
                    id: 'label',
                    type: 'textarea',
                    label: 'Question',
                    value: '',
                    placeholder: 'Posez la question',
                },
            ],
        },
        {
            name: 'Catégories de réponses proposées',
            inputs: [
                {
                    id: 'categories',
                    label: 'Catégorie',
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: '',
                            type: 'textarea',
                            label: '',
                            placeholder: 'Saisissez un intitulé catégorie..',
                            value: '',
                        },
                    ],
                },
            ],
        },
        {
            name: 'Réponses proposées',
            inputs: [
                {
                    id: 'responses',
                    label: 'Réponse',
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: 'label',
                            type: 'textarea',
                            label: '',
                            placeholder: 'Saisissez une réponse...',
                            value: '',
                        },
                        {
                            id: 'value',
                            type: 'hidden',
                            label: '',
                            placeholder: 'Valeur cachée',
                            value: '',
                        },
                        {
                            id: 'category',
                            type: 'select',
                            label: '',
                            placeholder: '',
                            value: '',
                            options: [],
                            linkedOptions: 'categories',
                        },
                    ],
                },
            ],
        },
        {
            name: 'Explication',
            inputs: [
                {
                    id: 'explanation',
                    type: 'html',
                    label: '',
                    value: '',
                    placeholder: 'Saisissez une explication',
                },
            ],
        },
    ],
};

export const reorderForm: Form = {
    type: 'reorder',
    name: 'Reorder',
    icon: 'icon-reorder',
    displayFieldIndex: true,
    buttons: contentButtons,
    fields: [
        {
            name: "Configuration de l'activité",
            inputs: [
                {
                    id: 'score',
                    type: 'score',
                    label: 'Score',
                    value: 0,
                },
            ],
        },
        {
            name: 'Question',
            inputs: [
                {
                    id: 'label',
                    type: 'textarea',
                    label: 'Question',
                    value: '',
                    placeholder: 'Posez la question',
                },
                {
                    id: 'statement',
                    type: 'textarea',
                    label: 'Consigne',
                    value: '',
                    placeholder: 'Instruction pour répondre à la question',
                },
            ],
        },
        {
            name: 'Réponses',
            inputs: [
                {
                    id: 'responses',
                    label: 'Réponse',
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: 'label',
                            type: 'textarea',
                            label: '',
                            placeholder: 'Saisissez une réponse...',
                            value: '',
                        },
                        {
                            id: 'value',
                            type: 'hidden',
                            label: '',
                            placeholder: 'Valeur cachée',
                            value: '',
                        },
                    ],
                },
            ],
        },
        {
            name: 'Explication',
            inputs: [
                {
                    id: 'explanation',
                    type: 'html',
                    label: '',
                    value: '',
                    placeholder: 'Saisissez une explication...',
                },
            ],
        },
    ],
};

export const swipeForm: Form = {
    type: 'swipe',
    name: 'Swipe',
    icon: 'icon-swipe',
    displayFieldIndex: true,
    buttons: contentButtons,
    fields: [
        {
            name: "Configuration de l'activité",
            inputs: [
                {
                    id: 'score',
                    type: 'score',
                    label: 'Score',
                    value: 0,
                },
            ],
        },
        {
            name: 'Question',
            inputs: [
                {
                    id: 'label',
                    type: 'textarea',
                    label: 'Question',
                    value: '',
                    placeholder: 'Posez la question',
                },
            ],
        },
        {
            name: 'Catégories de choix proposées',
            inputs: [
                {
                    id: 'categories',
                    label: 'Choix',
                    type: 'repeat',
                    value: ['Droite', 'Gauche'],
                    addButton: false,
                    inputs: [
                        {
                            id: '',
                            type: 'text',
                            label: '',
                            placeholder: 'Saisissez une réponse...',
                            value: '',
                        },
                    ],
                },
            ],
        },
        {
            name: 'Réponse proposée',
            inputs: [
                {
                    id: 'responses',
                    label: 'Carte',
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: 'label',
                            type: 'textarea',
                            label: '',
                            placeholder: 'Saisissez une proposition',
                            value: '',
                        },
                        {
                            id: 'value',
                            type: 'hidden',
                            label: '',
                            placeholder: 'Valeur cachée',
                            value: '',
                        },
                        {
                            id: 'category',
                            type: 'select',
                            label: '',
                            placeholder: '',
                            value: '',
                            options: [],
                            linkedOptions: 'categories',
                        },
                    ],
                },
            ],
        },
        {
            name: 'Explication',
            inputs: [
                {
                    id: 'explanation',
                    type: 'html',
                    label: '',
                    value: '',
                    placeholder: 'Saisissez une explication...',
                },
            ],
        },
    ],
};

export const listForm: Form = {
    type: 'dropdown-list',
    name: 'Liste déroulante',
    icon: 'icon-liste',
    displayFieldIndex: true,
    buttons: contentButtons,
    fields: [
        {
            name: "Configuration de l'activité",
            inputs: [
                {
                    id: 'score',
                    type: 'score',
                    label: 'Score',
                    value: 0,
                },
            ],
        },
        {
            name: 'Question',
            inputs: [
                {
                    id: 'label',
                    type: 'textarea',
                    label: 'Question',
                    value: '',
                    placeholder: 'Posez la question',
                },
                {
                    id: 'statement',
                    type: 'textarea',
                    label: 'Consigne',
                    value: '',
                    placeholder: 'Instruction pour répondre à la question',
                },
            ],
        },
        {
            name: 'Catégories de choix proposées',
            inputs: [
                {
                    id: 'categories',
                    label: 'Choix',
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: '',
                            type: 'text',
                            label: '',
                            placeholder: 'Saisissez une réponse...',
                            value: '',
                        },
                    ],
                },
            ],
        },
        {
            name: 'Cartes',
            inputs: [
                {
                    id: 'responses',
                    label: 'Carte',
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: 'label',
                            type: 'textarea',
                            label: '',
                            placeholder: 'Saisissez une question...',
                            value: '',
                        },
                        {
                            id: 'value',
                            type: 'hidden',
                            label: '',
                            placeholder: 'Valeur cachée',
                            value: '',
                        },
                        {
                            id: 'category',
                            type: 'select',
                            label: '',
                            placeholder: '',
                            value: '',
                            options: [],
                            linkedOptions: 'categories',
                        },
                    ],
                },
            ],
        },
        {
            name: 'Explication',
            inputs: [
                {
                    id: 'explanation',
                    type: 'html',
                    label: '',
                    value: '',
                    placeholder: 'Saisissez une explication...',
                },
            ],
        },
    ],
};


export const customQuestionForm: Form = {
    type: 'custom',
    name: 'Question personnalisée',
    icon: 'icon-terminal',
    displayFieldIndex: true,
    buttons: contentButtons,
    fields: [
        {
            name: "Configuration de l'activité",
            inputs: [
                {
                    id: 'score',
                    type: 'score',
                    label: 'Score',
                    value: 0,
                },
            ],
        },
        {
            name: 'Question',
            inputs: [
                {
                    id: 'label',
                    type: 'textarea',
                    label: 'Question',
                    value: '',
                    placeholder: 'Posez la question',
                },
                {
                    id: 'statement',
                    type: 'textarea',
                    label: 'Consigne',
                    value: '',
                    placeholder: 'Instruction pour répondre à la question',
                },
            ],
        },
        {
            name: 'Template',
            inputs: [
                {
                    id: 'template',
                    type: 'select',
                    label: 'Selectionnez un template',
                    value: '',
                    options: [],
                    linkedOptions: "plugins.*.template"
                }
            ]
        },
        {
            name: 'Données',
            inputs: [
                {
                    type: 'repeat',
                    id: 'data',
                    label: 'Données',
                    value: [],
                    inputs: [
                        {
                            id: 'key',
                            type: 'text',
                            label: 'Clé',
                            placeholder: 'Clé',
                            value: ''
                        },
                        {
                            id: 'value',
                            type: 'textarea',
                            label: 'Valeur',
                            placeholder: 'Valeur',
                            value: ''
                        }
                    ]
                }
            ]
        },
        {
            name: 'Réponse',
            inputs: [
                {
                    id: 'correctResponse',
                    label: 'Réponse',
                    type: 'text',
                    value: ''
                }
            ],
        },
        {
            name: 'Explication',
            inputs: [
                {
                    id: 'explanation',
                    type: 'html',
                    label: '',
                    value: '',
                    placeholder: 'Saisissez une explication',
                },
            ],
        },
    ],
};

export const questionForms: Form[] = [qcmForm, swipeForm, reorderForm, dragDropForm, listForm, customQuestionForm];
