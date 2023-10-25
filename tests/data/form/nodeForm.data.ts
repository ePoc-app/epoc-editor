import { TestForm } from '@/tests/types';

const epocForm: TestForm = {
    type: 'epoc',
    inputs: [
        {
            label: 'Edition',
            value: '2023',
            type: 'text'
        },
        {
            label: 'Titre',
            value: 'ePoc test',
            type: 'text'
        },
        {
            label: 'Présentation',
            value: 'Cet ePoc à été généré automatiquement',
            type: 'html'
        },
        {
            label: 'Nombre de badge pour obtenir l\'attestation',
            value: '5',
            type: 'score'
        }
    ]
};

const chapterForm: TestForm = {
    type: 'chapter',
    inputs: [
        {
            label: 'Titre',
            value: 'Chapitre test',
            type: 'text'
        }
    ]
};

const pageForm: TestForm = {
    type: 'page',
    inputs: [
        {
            label: 'Titre',
            value: 'Titre test',
            type: 'text'
        },
        {
            label: 'Sous-titre',
            value: 'Sous-titre test',
            type: 'text'
        },
        {
            label: 'Caché dans la table des matières',
            value: true,
            type: 'checkbox'
        },
        {
            label: 'Ne s\'affiche qu\'a certaines conditions',
            value: true,
            type: 'checkbox'
        }
    ]
};

const activityForm: TestForm = {
    type: 'activity',
    inputs: [
        {
            label: 'Titre',
            value: 'Titre test',
            type: 'text'
        },
        {
            label: 'Sous-titre',
            value: 'Sous-titre test',
            type: 'text'
        },
        {
            label: 'Résumé',
            value: 'Résumé test',
            type: 'textarea'
        },
        {
            label: 'Caché dans la table des matières',
            value: true,
            type: 'checkbox'
        },
        {
            label: 'Ne s\'affiche qu\'a certaines conditions',
            value: true,
            type: 'checkbox'
        }
    ]
};

export const nodeForms = [epocForm, chapterForm, pageForm, activityForm];