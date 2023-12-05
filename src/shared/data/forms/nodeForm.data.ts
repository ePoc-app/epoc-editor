import { Form } from '@/src/shared/interfaces';
import {activityButtons, baseButtons, pageButtons} from './formButtons.data';

export const conditionForm: Form = {
    type: 'condition',
    name: 'Conditions',
    icon: 'icon-condition',
    buttons: baseButtons,
    fields: [
        {
            inputs: [
                {
                    id: 'condition1',
                    type: 'text',
                    label: '',
                    value: '',
                    placeholder: 'Saisissez la condition 1...'
                },
                {
                    id: 'condition2',
                    type: 'text',
                    label: '',
                    value: '',
                    placeholder: 'Saisissez la condition 2...'
                }
            ]
        }
    ]
};

export const legacyConditionForm: Form = {
    type: 'legacy-condition',
    name: 'Conditions (legacy)',
    icon: 'icon-condition',
    buttons: baseButtons,
    fields: [
        {
            inputs: [
                {
                    id: 'label',
                    type: 'text',
                    label: 'Label',
                    value: '',
                    placeholder: 'Saisissez...'
                }
            ],
        },
        {
            name: 'Choix',
            inputs: [
                {
                    id: 'choices',
                    label: 'Choix',
                    type: 'repeat',
                    value: ['Parcours A', 'Parcours B'],
                    inputs: [
                        {
                            id: '',
                            type: 'text',
                            label: '',
                            placeholder: 'Parcours X',
                            value: ''
                        }
                    ]
                }
            ]
        },
        {
            name: 'Contenus conditionnels',
            inputs: [
                {
                    id: 'conditionalFlag',
                    label: 'Contenu',
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: 'id',
                            type: 'text',
                            label: '',
                            placeholder: 'Contenu',
                            value: '',
                        },
                        {
                            id: 'choice',
                            type: 'select',
                            label: '',
                            placeholder: '',
                            value: '',
                            options: [],
                            linkedOptions: 'choices'
                        }
                    ]
                }
            ]
        }
    ]
};


export const chapterForm: Form = {
    type: 'chapter',
    name: 'Chapitre',
    icon: 'icon-chapitre',
    buttons: baseButtons,
    fields: [
        {
            inputs: [
                {
                    id: 'title',
                    type: 'text',
                    label: 'Titre',
                    value: '',
                    placeholder: 'Saisissez...'
                }
            ],
        },
        {
            name: 'Objectifs',
            inputs: [
                {
                    id: 'objectives',
                    label: 'Objectif',
                    type: 'repeat',
                    value: [],
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
    ]
};

export const epocForm: Form = {
    type: 'epoc',
    name: 'A propos de l\'ePoc',
    icon: 'icon-epoc',
    buttons: [],
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
                    type: 'html',
                    label: 'Présentation',
                    value: '',
                    placeholder: 'Saisissez une présentation de l\'ePoc...'
                },
                {
                    id: 'edition',
                    type: 'text',
                    label: 'Edition',
                    value: String(new Date().getFullYear()),
                }
            ]
        },
        {
            name: 'Auteurs',
            inputs: [
                {
                    id: 'authors',
                    label: 'Auteur',
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: 'name',
                            type: 'text',
                            label: 'Nom',
                            placeholder: 'Jeanne Dupont',
                            value: ''
                        },
                        {
                            id: 'image',
                            type: 'file',
                            label: 'Image',
                            placeholder: 'Ajouter une image',
                            value: '',
                            accept: '.png,.jpg,.jpeg,.gif,.bmp,.svg,.webp'
                        },
                        {
                            id: 'title',
                            type: 'text',
                            label: 'Titre',
                            placeholder: 'Chercheuse à l\'Inria',
                            value: '',
                        },
                        {
                            id: 'description',
                            type: 'html',
                            label: 'Description',
                            placeholder: 'Saisissez une description...',
                            value: ''
                        }
                    ]
                }
            ]
        },
        {
            name: 'Objectifs',
            inputs: [
                {
                    id: 'objectives',
                    label: 'Objectif',
                    type: 'repeat',
                    value: [],
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
        },
        {
            name: 'Badges',
            inputs: [
                {
                    id: 'badges',
                    label: '',
                    type: 'badge',
                    value: [],
                }
            ]
        },
        {
            name: 'Paramètres :',
            inputs : [
                {
                    id: 'certificateScore',
                    type: 'score',
                    label: 'Score pour obtenir l\'attestation',
                    value: 10
                },
                {
                    id: 'certificateBadgeCount',
                    type: 'score',
                    label: 'Nombre de badge pour obtenir l\'attestation',
                    value: 1
                },
                {
                    id: 'chapterParameter',
                    type: 'text',
                    label: 'Label des chapitres',
                    value: '',
                    placeholder: 'Saisissez...'
                }
            ]
        },
        {
            name: 'Plugins',
            inputs: [
                {
                    id: 'plugins',
                    label: 'Plugin',
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: '',
                            type: 'file',
                            label: 'Fichier de plugin',
                            placeholder: 'Ajouter un plugin',
                            value: '',
                            accept: '.js'
                        }
                    ]
                }
            ]
        },
        {
            name: 'Licence',
            inputs: [
                {
                    id: 'licenceName',
                    type: 'text',
                    label: 'Nom',
                    placeholder: 'CC-BY 4.0',
                    value: ''
                },
                {
                    id: 'licenceUrl',
                    type: 'text',
                    label: 'URL',
                    placeholder: 'https://creativecommons.org/licenses/by/4.0/deed',
                    value: ''
                }
            ]
        }
    ],
};

export const pageForm: Form = {
    type: 'page',
    name: 'Page',
    icon: 'icon-ecran',
    buttons: pageButtons,
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
                {
                    id:'subtitle',
                    type: 'text',
                    label: 'Sous-titre',
                    value: '',
                    placeholder: 'Saisissez...'
                },
                {
                    id:'hidden',
                    type: 'checkbox',
                    label: 'Caché dans la table des matières',
                    value: false
                },
                {
                    id:'conditional',
                    type: 'checkbox',
                    label: 'Ne s\'affiche qu\'a certaines conditions',
                    value: false
                }
            ]
        },
        {
            name: 'Composants',
            inputs: [
                {
                    id: 'components',
                    label: 'Composants',
                    type: 'repeat',
                    value: [],
                    addButton: false,
                    inputs: []
                }
            ]
        }
    ]
};

export const activityForm: Form = {
    type: 'activity',
    name: 'Activité',
    icon: 'icon-ecran',
    buttons: activityButtons,
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
                {
                    id:'subtitle',
                    type: 'text',
                    label: 'Sous-titre',
                    value: '',
                    placeholder: 'Saisissez...'
                },
                {
                    id:'summary',
                    type: 'textarea',
                    label: 'Résumé',
                    value: '',
                    placeholder: 'Saisissez...'
                },
                {
                    id:'hidden',
                    type: 'checkbox',
                    label: 'Caché dans la table des matières',
                    value: false
                },
                {
                    id:'conditional',
                    type: 'checkbox',
                    label: 'Ne s\'affiche qu\'a certaines conditions',
                    value: false
                }
            ]
        },
        {
            name: 'Composants',
            inputs: [
                {
                    id: 'components',
                    label: 'Composants',
                    type: 'repeat',
                    value: [],
                    addButton: false,
                    inputs: []
                }
            ]
        }
    ]
};

export const nodeForms: Form[] = [chapterForm, pageForm, epocForm, conditionForm, legacyConditionForm, activityForm];