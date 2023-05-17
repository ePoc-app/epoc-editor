import { Form } from '@/src/shared/interfaces';
import { contentButtons } from './formButtons.data';

export const qcmForm: Form = {
    type: 'qcm',
    name: 'QCM',
    icon: 'icon-qcm',
    displayFieldIndex: true,
    buttons: contentButtons,
    fields: [
        {
            name: 'Configuration de l\'activité',
            inputs: [
                {
                    id: 'score',
                    type: 'score',
                    label: 'Score',
                    value: 0,
                }
            ]
        },
        {
            name: 'Question',
            inputs: [
                {
                    id: 'label',
                    type: 'textarea',
                    label: 'Question',
                    value: '',
                    placeholder: 'Posez la question'
                },
                {
                    id: 'statement',
                    type: 'textarea',
                    label: 'Consigne',
                    value: '',
                    placeholder: 'Instruction pour répondre à la question'
                }
            ]
        },
        {
            name: 'Réponses',
            inputs: [
                {
                    id: 'responses',
                    label: 'Réponse',
                    type: 'repeat',
                    value: '',
                    inputs: [
                        {
                            id: 'label',
                            type: 'textarea',
                            label: '',
                            placeholder: 'Saisissez une réponse ..',
                            value: ''
                        },
                        {
                            id: 'value',
                            type: 'hidden',
                            label: '',
                            placeholder: 'Valeur cachée',
                            value: ''
                        },
                        {
                            id: 'isCorrect',
                            type: 'checkbox',
                            label: 'Bonne réponse',
                            value: false
                        }
                    ]
                }
            ]
        },
        {
            name: 'Explication',
            inputs: [
                {
                    id: 'explanation',
                    type: 'ql-editor',
                    label: '',
                    value: '',
                    placeholder: 'Saisissez une explication'
                }
            ]
        }
    ]
};

export const dragDropForm: Form = {
    type: 'dragdrop',
    name: 'Drag & Drop',
    icon: 'icon-dragdrop',
    displayFieldIndex: true,
    buttons: contentButtons,
    fields: [
        {
            name: 'Configuration de l\'activité',
            inputs: [
                {
                    id: 'score',
                    type: 'score',
                    label: 'Score',
                    value: 0,
                }
            ]
        },
        {
            name: 'Question',
            inputs: [
                {
                    id: 'label',
                    type: 'textarea',
                    label: 'Question',
                    value: '',
                    placeholder: 'Posez la question'
                },
                {
                    id: 'statement',
                    type: 'textarea',
                    label: 'Consigne',
                    value: '',
                    placeholder: 'Instruction pour répondre à la question'
                }
            ]
        },
        {
            name: 'Catégories de réponses proposées',
            inputs: [
                {
                    id: 'categories',
                    label: 'Catégorie',
                    type: 'repeat',
                    value: '',
                    inputs: [
                        {
                            id: '',
                            type: 'textarea',
                            label: '',
                            placeholder: 'Saisissez un intitulé catégorie..',
                            value: '',
                        }
                    ]
                }
            ]
        },
        {
            name: 'Réponses proposées',
            inputs: [
                {
                    id: 'responses',
                    label: 'Réponse',
                    type: 'repeat',
                    value: '',
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
                            value: ''
                        },
                        {
                            id: 'choice',
                            type: 'select',
                            label: '',
                            placeholder: '',
                            value: '',
                            options: [],
                            linkedOptions: 'categories'
                        }
                    ]
                }
            ]
        },
        {
            name: 'Explication',
            inputs: [
                {
                    id: 'explanation',
                    type: 'ql-editor',
                    label: '',
                    value: '',
                    placeholder: 'Saisissez une explication'
                }
            ]
        }
    ]
};

export const reorderForm: Form = {
    type: 'reorder',
    name: 'Reorder',
    icon: 'icon-reorder',
    displayFieldIndex: true,
    buttons: contentButtons,
    fields: [
        {
            name: 'Configuration de l\'activité',
            inputs: [
                {
                    id: 'score',
                    type: 'score',
                    label: 'Score',
                    value: 0,
                }
            ]
        },
        {
            name: 'Question',
            inputs: [
                {
                    id: 'label',
                    type: 'textarea',
                    label: 'Question',
                    value: '',
                    placeholder: 'Posez la question'
                },
                {
                    id: 'statement',
                    type: 'textarea',
                    label: 'Consigne',
                    value: '',
                    placeholder: 'Instruction pour répondre à la question'
                }
            ]
        },
        {
            name: 'Réponses',
            inputs: [
                {
                    id: 'responses',
                    label: 'Réponse',
                    type: 'repeat',
                    value: '',
                    inputs: [
                        {
                            id: 'label',
                            type: 'textarea',
                            label: '',
                            placeholder: 'Saisissez une réponse...',
                            value: ''
                        },
                        {
                            id: 'value',
                            type: 'hidden',
                            label: '',
                            placeholder: 'Valeur cachée',
                            value: ''
                        },
                    ]
                }
            ]
        },
        {
            name: 'Explication',
            inputs: [
                {
                    id: 'explanation',
                    type: 'ql-editor',
                    label: '',
                    value: '',
                    placeholder: 'Saisissez une explication...'
                }
            ]
        }
    ]
};

export const swipeForm: Form = {
    type: 'swipe',
    name: 'Swipe',
    icon: 'icon-swipe',
    displayFieldIndex: true,
    buttons: contentButtons,
    fields: [
        {
            name: 'Configuration de l\'activité',
            inputs: [
                {
                    id: 'score',
                    type: 'score',
                    label: 'Score',
                    value: 0,
                }
            ]
        },
        {
            name: 'Question',
            inputs: [
                {
                    id: 'label',
                    type: 'textarea',
                    label: 'Question',
                    value: '',
                    placeholder: 'Posez la question'
                },
                {
                    id: 'statement',
                    type: 'textarea',
                    label: 'Consigne',
                    value: '',
                    placeholder: 'Instruction pour répondre à la question'
                }
            ]
        },
        {
            name: 'Catégories de choix proposées',
            inputs: [
                {
                    id: 'left',
                    type: 'text',
                    label: 'Choix gauche',
                    value: '',
                    placeholder: 'Saisissez une réponse...'
                },
                {
                    id: 'right',
                    type: 'text',
                    label: 'Choix droite',
                    value: '',
                    placeholder: 'Saisissez une réponse...'
                }
            ]
        },
        {
            name: 'Réponse proposée',
            inputs: [
                {
                    id: 'responses',
                    label: 'Carte',
                    type: 'repeat',
                    value: '',
                    inputs: [
                        {
                            id: 'label',
                            type: 'textarea',
                            label: '',
                            placeholder: 'Saisissez une proposition',
                            value: ''
                        },
                        {
                            id: 'value',
                            type: 'hidden',
                            label: '',
                            placeholder: 'Valeur cachée',
                            value: ''
                        },
                        {
                            id:  'correctReponse',
                            type: 'radio-group',
                            label: 'Réponse',
                            value: 0
                        }

                    ]
                }
            ]
        },
        {
            name: 'Explication',
            inputs: [
                {
                    id: 'explanation',
                    type: 'ql-editor',
                    label: '',
                    value: '',
                    placeholder: 'Saisissez une explication...'
                }
            ]
        }
    ]
};

export const listForm: Form = {
    type: 'list',
    name: 'Listes déroulantes',
    icon: 'icon-liste',
    displayFieldIndex: true,
    buttons: contentButtons,
    fields: [
        {
            name: 'Configuration de l\'activité',
            inputs: [
                {
                    id: 'score',
                    type: 'score',
                    label: 'Score',
                    value: 0,
                }
            ]
        },
        {
            name: 'Question',
            inputs: [
                {
                    id: 'label',
                    type: 'textarea',
                    label: 'Question',
                    value: '',
                    placeholder: 'Posez la question'
                },
                {
                    id: 'statement',
                    type: 'textarea',
                    label: 'Consigne',
                    value: '',
                    placeholder: 'Instruction pour répondre à la question'
                }
            ]
        },
        {
            name: 'Catégories de choix proposées',
            inputs: [
                {
                    id: 'categories',
                    label: 'Choix',
                    type: 'repeat',
                    value: '',
                    inputs: [
                        {
                            id: '',
                            type: 'text',
                            label: '',
                            placeholder: 'Saisissez une réponse...',
                            value: ''
                        }
                    ]
                }
            ]
        },
        {
            name: 'Cartes',
            inputs: [
                {
                    id: 'responses',
                    label: 'Carte',
                    type: 'repeat',
                    value: '',
                    inputs: [
                        {
                            id: 'label',
                            type: 'textarea',
                            label: '',
                            placeholder: 'Saisissez une question...',
                            value: ''
                        },
                        {
                            id: 'value',
                            type: 'hidden',
                            label: '',
                            placeholder: 'Valeur cachée',
                            value: ''
                        },
                        {
                            id: 'choice',
                            type: 'select',
                            label: '',
                            placeholder: '',
                            value: '',
                            options: [],
                            linkedOptions: 'categories'
                        }
                    ]
                }
            ]
        },
        {
            name: 'Explication',
            inputs: [
                {
                    id: 'explanation',
                    type: 'ql-editor',
                    label: '',
                    value: '',
                    placeholder: 'Saisissez une explication...'
                }
            ]
        }
    ]
};

export const questionForms: Form[] = [qcmForm, swipeForm, reorderForm, dragDropForm, listForm];