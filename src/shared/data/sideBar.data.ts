import { SideAction } from '@/src/shared/interfaces';
import { i18n } from '@/src/i18n/config';

const { t } = i18n.global;

export const questions: SideAction[] = [
    {
        icon: 'icon-qcm',
        type: 'choice',
        label: t('questions.types.qcm'),
    },
    {
        icon: 'icon-dragdrop',
        type: 'drag-and-drop',
        label: t('questions.types.dragDrop'),
    },
    {
        icon: 'icon-reorder',
        type: 'reorder',
        label: t('questions.types.reorder'),
    },
    {
        icon: 'icon-swipe',
        type: 'swipe',
        label: t('questions.types.swipe'),
    },
    {
        icon: 'icon-liste',
        type: 'dropdown-list',
        label: t('questions.types.dropdownList'),
    },
    {
        icon: 'icon-terminal',
        type: 'custom',
        label: t('questions.types.custom'),
    }
];

const contents: SideAction[] = [
    {
        icon: 'icon-texte',
        type: 'text',
        label: t('sidebar.content.text'),
        tooltip: t('sidebar.content.textTooltip'),
    },
    {
        icon: 'icon-video',
        type: 'video',
        label: t('sidebar.content.video'),
        tooltip: t('sidebar.content.videoTooltip'),
    },
    {
        icon: 'icon-audio',
        type: 'audio',
        label: t('sidebar.content.audio'),
        tooltip: t('sidebar.content.audioTooltip'),
    },
];

export const standardActions = [...questions, ...contents];

export const standardPages: SideAction[] = [
    {
        icon: 'icon-texte',
        type: 'text',
        label: t('sidebar.content.text'),
        tooltip: t('sidebar.content.textTooltip'),
    },
    {
        icon: 'icon-video',
        type: 'video',
        label: t('sidebar.content.video'),
        tooltip: t('sidebar.content.videoTooltip'),
    },
    {
        icon: 'icon-audio',
        type: 'audio',
        label: t('sidebar.content.audio'),
        tooltip: t('sidebar.content.audioTooltip'),
    },
    {
        icon: 'icon-question',
        type: 'question',
        label: t('sidebar.pages.question'),
        tooltip: t('sidebar.pages.questionTooltip'),
    },
    {
        icon: 'icon-condition',
        type: 'condition',
        label: t('sidebar.pages.conditions'),
        tooltip: t('sidebar.pages.conditionsTooltip'),
    },
    {
        icon: 'icon-condition-legacy',
        type: 'legacy-condition',
        label: t('sidebar.pages.conditionsLegacy'),
        tooltip: t('sidebar.pages.conditionsTooltip'),
    },
    {
        icon: 'icon-modele',
        type: 'model',
        label: t('sidebar.pages.model'),
        tooltip: t('sidebar.pages.modelTooltip'),
    },
    {
        icon: 'icon-badge',
        type: 'badge',
        label: t('sidebar.pages.badge'),
        tooltip: t('sidebar.pages.badgeTooltip'),
    },
];
