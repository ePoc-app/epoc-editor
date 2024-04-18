import { SideAction } from '@/src/shared/interfaces';

export const questions: SideAction[] = [
    {
        icon: 'icon-qcm',
        type: 'choice',
        label: 'QCM',
    },
    {
        icon: 'icon-dragdrop',
        type: 'drag-and-drop',
        label: 'Drag & Drop',
    },
    {
        icon: 'icon-reorder',
        type: 'reorder',
        label: 'Reorder',
    },
    {
        icon: 'icon-swipe',
        type: 'swipe',
        label: 'Swipe',
    },
    {
        icon: 'icon-liste',
        type: 'dropdown-list',
        label: 'Liste déroulante',
    },
    {
        icon: 'icon-terminal',
        type: 'custom',
        label: 'Question personnalisée',
    }
];

const contents: SideAction[] = [
    {
        icon: 'icon-texte',
        type: 'text',
        label: 'Texte',
        tooltip: 'Glisser/déposer pour ajouter un texte',
    },
    {
        icon: 'icon-video',
        type: 'video',
        label: 'Vidéo',
        tooltip: 'Glisser/déposer pour ajouter une vidéo',
    },
    {
        icon: 'icon-audio',
        type: 'audio',
        label: 'Audio',
        tooltip: 'Glisser/déposer pour ajouter un audio',
    },
];

export const standardActions = [...questions, ...contents];

export const standardPages: SideAction[] = [
    {
        icon: 'icon-texte',
        type: 'text',
        label: 'Texte',
        tooltip: 'Glisser/déposer pour ajouter un texte',
    },
    {
        icon: 'icon-video',
        type: 'video',
        label: 'Vidéo',
        tooltip: 'Glisser/déposer pour ajouter une vidéo',
    },
    {
        icon: 'icon-audio',
        type: 'audio',
        label: 'Audio',
        tooltip: 'Glisser/déposer pour ajouter un audio',
    },
    {
        icon: 'icon-question',
        type: 'question',
        label: 'Question',
        tooltip: 'Cliquer pour ajouter une question',
    },
    {
        icon: 'icon-condition',
        type: 'condition',
        label: 'Conditions',
        tooltip: 'Glisser/déposer pour ajouter une condition',
    },
    {
        icon: 'icon-condition-legacy',
        type: 'legacy-condition',
        label: 'Conditions (legacy)',
        tooltip: 'Glisser/déposer pour ajouter une condition',
    },
    {
        icon: 'icon-modele',
        type: 'model',
        label: 'Modèle',
        tooltip: 'Cliquer pour ouvrir le menu modèle',
    },
    {
        icon: 'icon-badge',
        type: 'badge',
        label: 'Badge',
        tooltip: 'Cliquer pour ouvrir le menu badge',
    },
];
