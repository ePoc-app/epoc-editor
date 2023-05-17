import { SideAction } from '@/src/shared/interfaces';

export const standardPages: SideAction[] = [
    {
        icon: 'icon-texte',
        type: 'text',
        label: 'Texte',
        tooltip: 'Glisser/déposer pour ajouter un texte'
    },
    {
        icon: 'icon-video',
        type: 'video',
        label: 'Vidéo',
        tooltip: 'Glisser/déposer pour ajouter une vidéo'
    },
    {
        icon: 'icon-audio',
        type: 'audio',
        label: 'Audio',
        tooltip: 'Glisser/déposer pour ajouter un audio'
    },
    {
        icon: 'icon-question',
        type: 'question',
        label: 'Question',
        tooltip: 'Cliquer pour ajouter une question'
    },
    {
        icon: 'icon-condition',
        type: 'condition',
        label: 'Conditions',
        tooltip: 'Glisser/déposer pour ajouter une condition'
    },
    {
        icon: 'icon-modele',
        type: 'model',
        label: 'Modèle',
        tooltip: 'Cliquer pour ajouter un modèle'
    }
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