import { Form } from '../interfaces';

const textForm: Form = {
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

const videoForm: Form = {
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
                    placeholder: 'Ajouter une vidéo',
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
                    type: 'file',
                    label: 'Transcription',
                    value: '',
                    placeholder: 'Ajouter une transcription',
                    accept: 'text/*'
                },
                {
                    type: 'file',
                    label: 'Vignette',
                    value: '',
                    placeholder: 'Ajouter une vignette',
                    accept: 'image/*'
                },
                {
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


const chapterForm: Form = {
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
            type: 'cardGroup',
            inputType: 'objective',
            inputs: []
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

const epocForm: Form = {
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
                    placeholder: 'Ajouter une image de couverture',
                    value: '',
                    accept: 'image/*'
                },
                {
                    type: 'file',
                    label: 'Vignette',
                    value: '',
                    placeholder: 'Ajouter une vignette',
                    accept: 'image/*'
                },
                {
                    type: 'file',
                    label: 'Teaser',
                    value: '',
                    placeholder: 'Ajouter un teaser',
                    accept: 'video/*'
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
};

const screenForm: Form = { 
    type: 'screen',
    name: 'Écran',
    icon: 'icon-ecran',
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

const audioForm: Form = {
    type: 'audio',
    name: 'Audio',
    icon: 'icon-audio',
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
                    label: 'Piste audio',
                    value: '',
                    placeholder: 'Ajouter une piste audio',
                    accept: 'audio/*'
                },
                {
                    type: 'file',
                    label: 'Transcription',
                    value: '',
                    placeholder: 'Ajouter une transcription',
                    accept: 'text/*'
                },
                {
                    type: 'file',
                    label: 'Vignette',
                    value: '',
                    placeholder: 'Ajouter une vignette',
                    accept: 'image/*'
                },
                {
                    type: 'file',
                    label: 'Sous-titres',
                    value: '',
                    placeholder: 'Ajouter des sous-titres',
                    accept: '.vtt'
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

const qcmForm: Form = {
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
                },
                {
                    type: 'score',
                    label: 'Score',
                    value: '0',
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
            type: 'cardGroup',
            inputType: 'check',
            inputs: []
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
};

const dragDropForm: Form = {
    type: 'dragdrop',
    name: 'Drag & Drop',
    icon: 'icon-dragdrop',
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
                    placeholder: 'Saisissez...'
                },
                {
                    type: 'score',
                    label: 'Score',
                    value: '0',
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
            name: 'Catégories de réponses proposées',
            index: 3,
            type: 'cardGroup',
            inputType: 'category',
            inputs: [],
        },
        {
            name: 'Réponses proposées',
            index: 4,
            type: 'cardGroup',
            inputType: 'dd',
            inputs: [],
        },
        {
            name: 'Explication',
            index: 5,
            inputs: [
                {
                    type: 'textarea',
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

const reorderForm: Form = {
    type: 'reorder',
    name: 'Reorder',
    icon: 'icon-reorder',
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
                    placeholder: 'Saisissez...'
                },
                {
                    type: 'score',
                    label: 'Score',
                    value: '0',
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
            type: 'cardGroup',
            inputType: 'reorder',
            inputs: [],
        },
        {
            name: 'Explication',
            index: 4,
            inputs: [
                {
                    type: 'textarea',
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

const swipeForm: Form = {
    type: 'swipe',
    name: 'Swipe',
    icon: 'icon-swipe',
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
                    placeholder: 'Saisissez...'
                },
                {
                    type: 'score',
                    label: 'Score',
                    value: '0',
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
            name: 'Catégories de choix proposées',
            index: 3,
            inputs: [
                {
                    type: 'text',
                    label: 'Choix gauche',
                    value: '',
                    placeholder: 'Saisissez une réponse...'
                },
                {
                    type: 'text',
                    label: 'Choix droite',
                    value: '',
                    placeholder: 'Saisissez une réponse...'
                }
            ]
        },
        {
            name: 'Cartes',
            index: 4,
            type: 'cardGroup',
            inputType: 'swipe',
            inputs: [],
        },
        {
            name: 'Explication',
            index: 5,
            inputs: [
                {
                    type: 'textarea',
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

export const formsModel: Form[] = [textForm, videoForm, qcmForm, chapterForm, epocForm, screenForm, audioForm, dragDropForm, reorderForm, swipeForm];
