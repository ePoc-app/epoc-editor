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
};

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
};

export const formsModel: Form[] = [textForm, videoForm, qcmForm, chapterForm, epocForm];