import { Form } from '@/src/shared/interfaces';
import { activityButtons, baseButtons, pageButtons } from './formButtons.data';

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
                    placeholder: 'Saisissez la condition 1...',
                },
                {
                    id: 'condition2',
                    type: 'text',
                    label: '',
                    value: '',
                    placeholder: 'Saisissez la condition 2...',
                },
            ],
        },
    ],
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
                    placeholder: 'Saisissez...',
                },
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
                            value: '',
                        },
                    ],
                },
            ],
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
                            linkedOptions: 'choices',
                        },
                    ],
                },
            ],
        },
    ],
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
                    placeholder: 'Saisissez...',
                },
            ],
        },
        {
            name: 'Objectifs pédagogiques',
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
                            value: '',
                        },
                    ],
                },
            ],
        },
    ],
};

export const epocForm: Form = {
    type: 'epoc',
    name: "A propos de l'ePoc",
    icon: 'icon-epoc',
    buttons: [],
    fields: [
        {
            inputs: [
                {
                    id: 'title',
                    type: 'text',
                    label: 'Titre',
                    value: '',
                    placeholder: 'Saisissez...',
                },
                {
                    id: 'image',
                    type: 'file',
                    label: 'Image de couverture',
                    placeholder: 'Ajouter une image de couverture',
                    value: '',
                    accept: '.png,.jpg,.jpeg,.gif,.bmp,.svg,.webp',
                    hint: 'Format recommandé : carré (180x180)<br> Image visible dans la liste des ePocs',
                },
                {
                    id: 'teaser',
                    type: 'file',
                    label: 'Teaser vidéo',
                    value: '',
                    placeholder: 'Ajouter un teaser',
                    accept: '.mp4',
                    hint: 'Format recommandé : 16:9 (720x480) <br> Vidéo visible dans la page de présentation de l\'ePoc'
                },
                {
                    id: 'thumbnail',
                    type: 'file',
                    label: 'Vignette de la vidéo',
                    value: '',
                    placeholder: 'Ajouter une vignette',
                    accept: '.png,.jpg,.jpeg,.gif,.bmp,.svg,.webp',
                    hint: 'Format recommandé : idem que la vidéo <br> Image visible dans la page de présentation de l\'ePoc'
                },
                {
                    id: 'summary',
                    type: 'html-text',
                    label: 'Présentation',
                    value: '',
                    placeholder: "Saisissez une présentation de l'ePoc...",
                },
                {
                    id: 'edition',
                    type: 'text',
                    label: 'Edition',
                    value: String(new Date().getFullYear()),
                },
            ],
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
                            value: '',
                        },
                        {
                            id: 'image',
                            type: 'file',
                            label: 'Image',
                            placeholder: 'Ajouter une image',
                            value: '',
                            accept: '.png,.jpg,.jpeg,.gif,.bmp,.svg,.webp',
                            hint: 'Format recommandé : carré (100x100)<br> Image visible dans la page de présentation de l\'ePoc',
                        },
                        {
                            id: 'title',
                            type: 'text',
                            label: 'Fonction',
                            placeholder: "Chercheuse à l'Inria",
                            value: '',
                            hint: 'Profession, fonction, affiliation…',
                        },
                        {
                            id: 'description',
                            type: 'html-text',
                            label: 'Courte biographie',
                            placeholder: 'Saisissez une courte biographie...',
                            value: '',
                        },
                    ],
                },
            ],
        },
        {
            name: 'Objectifs pédagogiques',
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
                            value: '',
                        },
                    ],
                },
            ],
        },
        {
            name: 'Paramètres :',
            inputs: [
                {
                    id: 'certificateBadgeCount',
                    type: 'score',
                    label: "Nombre de badge pour obtenir l'attestation",
                    value: 1,
                },
                {
                    id: 'certificateScore',
                    type: 'score',
                    label: "Score pour obtenir l'attestation",
                    value: 10,
                    hint: 'N\'est pas pris en compte si le nombre de badge pour obtenir l\'attestation est supérieur à 0',
                },
                {
                    id: 'chapterParameter',
                    type: 'text',
                    label: 'Label des chapitres',
                    value: '',
                    placeholder: 'Saisissez...',
                },
            ],
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
                            id: 'script',
                            type: 'file',
                            label: 'Fichier de script',
                            placeholder: 'Ajouter un script',
                            targetDirectory: 'plugins',
                            value: '',
                            accept: '.js',
                        },
                        {
                            id: 'template',
                            type: 'file',
                            label: 'Template html du plugin',
                            placeholder: 'Ajouter un template',
                            targetDirectory: 'plugins',
                            value: '',
                            accept: 'html'
                        }
                    ],
                },
            ],
        },
        {
            name: 'Licence',
            inputs: [
                {
                    id: 'licenceName',
                    type: 'text',
                    label: 'Nom',
                    placeholder: 'CC-BY 4.0',
                    value: '',
                    hint: 'Nom de la licence de votre contenu ePoc'
                },
                {
                    id: 'licenceUrl',
                    type: 'text',
                    label: 'URL',
                    placeholder: 'https://creativecommons.org/licenses/by/4.0/deed',
                    value: '',
                    hint: 'Texte complet de la licence choisie'
                },
            ],
        },
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
                    id: 'title',
                    type: 'text',
                    label: 'Titre',
                    value: '',
                    placeholder: 'Saisissez...',
                },
                {
                    id: 'subtitle',
                    type: 'text',
                    label: 'Sous-titre',
                    value: '',
                    placeholder: 'Saisissez...',
                },
                {
                    id: 'hidden',
                    type: 'checkbox',
                    label: 'Caché dans la table des matières',
                    value: false,
                },
                {
                    id: 'conditional',
                    type: 'checkbox',
                    label: "Ne s'affiche qu'a certaines conditions",
                    value: false,
                    hint: 'Option utilisé pour l\'affichage conditionnel'
                },
            ],
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
                    inputs: [],
                },
            ],
        },
    ],
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
                    id: 'title',
                    type: 'text',
                    label: 'Titre',
                    value: '',
                    placeholder: 'Saisissez...',
                },
                {
                    id: 'subtitle',
                    type: 'text',
                    label: 'Sous-titre',
                    value: '',
                    placeholder: 'Saisissez...',
                },
                {
                    id: 'summary',
                    type: 'textarea',
                    label: 'Résumé',
                    value: '',
                    placeholder: 'Saisissez...',
                },
                {
                    id: 'hidden',
                    type: 'checkbox',
                    label: 'Caché dans la table des matières',
                    value: false,
                },
                {
                    id: 'conditional',
                    type: 'checkbox',
                    label: "Ne s'affiche qu'a certaines conditions",
                    value: false,
                    hint: 'Option utilisé pour l\'affichage conditionnel'
                },
            ],
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
                    inputs: [],
                },
            ],
        },
    ],
};

export const nodeForms: Form[] = [chapterForm, pageForm, epocForm, conditionForm, legacyConditionForm, activityForm];
