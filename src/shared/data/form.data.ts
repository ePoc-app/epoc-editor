import { Form, SideAction } from '@/src/shared/interfaces';

export const textForm: Form = {
    type: 'text',
    name: 'Contenu',
    icon: 'icon-texte',
    fields: [
        {
            inputs: [
                {
                    id: 'html',
                    type: 'ql-editor',
                    label: 'Résumé',
                    value: '',
                    placeholder: 'Saisissez un résumé...'
                },
                {
                    id: 'poster',
                    type: 'file',
                    label: 'Vignette',
                    placeholder: 'Ajouter une vignette',
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
};

export const videoForm: Form = {
    type: 'video',
    name: 'Vidéo',
    icon: 'icon-video',
    fields: [
        {
            inputs: [
                {
                    id: 'source',
                    type: 'file',
                    label: 'Vidéo',
                    placeholder: 'Ajouter une vidéo',
                    value: '',
                    accept: '.mp4'
                },
                {
                    id: 'summary',
                    type: 'ql-editor',
                    label: 'Résumé',
                    value: '',
                    placeholder: 'Saisissez...'
                },
                {
                    id: 'transcript',
                    type: 'file',
                    label: 'Transcription',
                    value: '',
                    placeholder: 'Ajouter une transcription',
                    accept: '.txt,.vtt'
                },
                {
                    id: 'poster',
                    type: 'file',
                    label: 'Vignette',
                    value: '',
                    placeholder: 'Ajouter une vignette',
                    accept: '.png,.jpg,.jpeg,.gif,.bmp,.svg,.webp'
                },
                {
                    id: 'subtitles',
                    type: 'file',
                    label: 'Sous-titres',
                    value: '',
                    placeholder: 'Ajouter des sous-titres',
                    accept: '.vtt'
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
};


export const chapterForm: Form = {
    type: 'chapter',
    name: 'Chapitre',
    icon: 'icon-chapitre',
    fields: [
        {
            inputs: [
                {
                    id: 'title',
                    type: 'text',
                    label: 'Titre',
                    value: '',
                    placeholder: 'Saisissez...'
                },
                {
                    id: 'image',
                    type: 'file',
                    label: 'Image',
                    placeholder: 'Ajouter une image',
                    value: '',
                    accept: 'image/*'
                },
            ],
        },
        {
            name: 'Objectifs',
            inputs: [
                {
                    id: 'objectives',
                    label: 'Objectif',
                    type: 'repeat',
                    value: '',
                    inputs: [
                        {
                            id: '',
                            type: 'textarea',
                            label: '',
                            placeholder: 'Saisissez un objectif ...',
                            value: ''
                        }
                    ]
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
};

export const epocForm: Form = {
    type: 'epoc',
    name: 'Paramètre de l\'ePoc',
    icon: 'icon-epoc',
    fields: [
        {
            inputs :[
                {
                    id: 'title',
                    type: 'text',
                    label: 'Titre',
                    value: '',
                    placeholder: 'Saisissez...'
                },
                {
                    id: 'chapterParameter',
                    type: 'text',
                    label: 'Label des chapitres',
                    value: '',
                    placeholder: 'Saisissez...'
                },
                {
                    id: 'image',
                    type: 'file',
                    label: 'Image de couverture',
                    placeholder: 'Ajouter une image de couverture',
                    value: '',
                    accept: '.png,.jpg,.jpeg,.gif,.bmp,.svg,.webp'
                },
                {
                    id: 'teaser',
                    type: 'file',
                    label: 'Teaser vidéo',
                    value: '',
                    placeholder: 'Ajouter un teaser',
                    accept: '.mp4'
                },
                {
                    id: 'thumbnail',
                    type: 'file',
                    label: 'Vignette de la vidéo',
                    value: '',
                    placeholder: 'Ajouter une vignette',
                    accept: '.png,.jpg,.jpeg,.gif,.bmp,.svg,.webp'
                },
                {
                    id: 'summary',
                    type: 'ql-editor',
                    label: 'Présentation',
                    value: '',
                    placeholder: 'Saisissez une présentation de l\'ePoc...'
                },
                {
                    id: 'id',
                    type: 'text',
                    label: 'ID de l\'ePoc',
                    value: 'E000XX',
                    
                },
                {
                    id: 'edition',
                    type: 'text',
                    label: 'Edition',
                    value: String(new Date().getFullYear()),
                }
            ]
        }

    ],
    buttons: [
        {
            label: 'Copier le lien',
            icon: 'icon-copie',
            action: 'copy'
        },
    ]
};

export const screenForm: Form = { 
    type: 'screen',
    name: 'Écran',
    icon: 'icon-ecran',
    fields: [
        {
            inputs: [
                {
                    id:'title',
                    type: 'text',
                    label: 'Titre',
                    value: '',
                    placeholder: 'Saisissez...'
                },
            ]
        },
        {
            name: 'Composants',
            inputs: [
                {
                    id: 'components',
                    label: 'Composants',
                    type: 'repeat',
                    value: '',
                    addButton: false,
                    inputs: []
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
};


// Question forms

export const qcmForm: Form = {
    type: 'qcm',
    name: 'QCM',
    icon: 'icon-qcm',
    displayFieldIndex: true,
    fields: [
        {
            name: 'Configuration de l\'activité',
            inputs: [
                {
                    id: 'label',
                    type: 'textarea',
                    label: 'Énoncé',
                    value: '',
                    placeholder: 'Saisissez'
                },
                {
                    id: 'score',
                    type: 'score',
                    label: 'Score',
                    value: '0',
                }
            ]
        },
        {
            name: 'Question',
            inputs: [
                {
                    id: 'statement',
                    type: 'textarea',
                    label: '',
                    value: '',
                    placeholder: 'Saisissez l\'intitulé de la question...'
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
                            id: 'response',
                            type: 'textarea',
                            label: '',
                            placeholder: 'Saisissez une réponse ..',
                            value: ''
                        },
                        {
                            id: 'isCorrect',
                            type: 'checkbox',
                            label: 'Bonne réponse',
                            value: 'false'
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
};

export const dragDropForm: Form = {
    type: 'dragdrop',
    name: 'Drag & Drop',
    icon: 'icon-dragdrop',
    displayFieldIndex: true,
    fields: [
        {
            name: 'Configuration de l\'activité',
            inputs: [
                {
                    id: 'label',
                    type: 'textarea',
                    label: 'Énoncé',
                    value: '',
                    placeholder: 'Saisissez...'
                },
                {
                    id: 'score',
                    type: 'score',
                    label: 'Score',
                    value: '0',
                }
            ]
        },
        {
            name: 'Question',
            inputs: [
                {
                    id: 'explanation',
                    type: 'textarea',
                    label: '',
                    value: '',
                    placeholder: 'Saisissez l\'intitulé de la question...'
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
                            id: 'response',
                            type: 'textarea',
                            label: '',
                            placeholder: 'Saisissez une réponse...',
                            value: '',
                        },
                        {
                            id: 'choice',
                            type: 'select',
                            label: '',
                            placeholder: '',
                            value: '',
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
};

export const reorderForm: Form = {
    type: 'reorder',
    name: 'Reorder',
    icon: 'icon-reorder',
    displayFieldIndex: true,
    fields: [
        {
            name: 'Configuration de l\'activité',
            inputs: [
                {
                    id: 'label',
                    type: 'textarea',
                    label: 'Énoncé',
                    value: '',
                    placeholder: 'Saisissez...'
                },
                {
                    id: 'score',
                    type: 'score',
                    label: 'Score',
                    value: '0',
                }
            ]
        },
        {
            name: 'Question',
            inputs: [
                {
                    id: 'statement',
                    type: 'textarea',
                    label: '',
                    value: '',
                    placeholder: 'Saisissez l\'intitulé de la question...'
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
                            id: '',
                            type: 'textarea',
                            label: '',
                            placeholder: 'Saisissez une réponse...',
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
};

export const swipeForm: Form = {
    type: 'swipe',
    name: 'Swipe',
    icon: 'icon-swipe',
    displayFieldIndex: true,
    fields: [
        {
            name: 'Configuration de l\'activité',
            inputs: [
                {
                    id: 'label',
                    type: 'textarea',
                    label: 'Énoncé',
                    value: '',
                    placeholder: 'Saisissez...'
                },
                {
                    id: 'score',
                    type: 'score',
                    label: 'Score',
                    value: '0',
                }
            ]
        },
        {
            name: 'Question',
            inputs: [
                {
                    id: 'statement',
                    type: 'textarea',
                    label: '',
                    value: '',
                    placeholder: 'Saisissez l\'intitulé de la question...'
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
                            id: 'response',
                            type: 'textarea',
                            label: '',
                            placeholder: 'Saisissez une proposition',
                            value: ''
                        },
                        {
                            id:  'correctReponse',
                            type: 'radio-group',
                            label: 'Réponse',
                            value: '0'
                        }

                    ]
                }
            ]
        },
        {
            name: 'Explication',
            index: 5,
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
};

export const listForm: Form = {
    type: 'list',
    name: 'Listes déroulantes',
    icon: 'icon-liste',
    displayFieldIndex: true,
    fields: [
        {
            name: 'Configuration de l\'activité',
            inputs: [
                {
                    id: 'label',
                    type: 'textarea',
                    label: 'Énoncé',
                    value: '',
                    placeholder: 'Saisissez...'
                },
                {
                    id: 'score',
                    type: 'score',
                    label: 'Score',
                    value: '0',
                }
            ]
        },
        {
            name: 'Question',
            inputs: [
                {
                    id: 'statement',
                    type: 'textarea',
                    label: '',
                    value: '',
                    placeholder: 'Saisissez l\'intitulé de la question...'
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
                            id: 'response',
                            type: 'textarea',
                            label: '',
                            placeholder: 'Saisissez une question...',
                            value: ''
                        },
                        {
                            id: 'choice',
                            type: 'select',
                            label: '',
                            placeholder: '',
                            value: ''
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
};

export const formsModel: Form[] = [textForm, videoForm, chapterForm, screenForm, epocForm, qcmForm, swipeForm, reorderForm, listForm, dragDropForm];

export const standardScreen: SideAction[] = [
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

export const questions: SideAction[] = [
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

