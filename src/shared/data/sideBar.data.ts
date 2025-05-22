import { SideAction } from '@/src/shared/interfaces';
import { i18n } from '@/i18n/config';
import { computed, ComputedRef } from 'vue';

export const questions: ComputedRef<SideAction[]> = computed(() => [
    {
        icon: 'icon-qcm',
        type: 'choice',
        label: i18n.global.t('questions.types.qcm'),
    },
    {
        icon: 'icon-dragdrop',
        type: 'drag-and-drop',
        label: i18n.global.t('questions.types.dragDrop'),
    },
    {
        icon: 'icon-reorder',
        type: 'reorder',
        label: i18n.global.t('questions.types.reorder'),
    },
    {
        icon: 'icon-swipe',
        type: 'swipe',
        label: i18n.global.t('questions.types.swipe'),
    },
    {
        icon: 'icon-liste',
        type: 'dropdown-list',
        label: i18n.global.t('questions.types.dropdownList'),
    },
    {
        icon: 'icon-terminal',
        type: 'custom',
        label: i18n.global.t('questions.types.custom'),
    },
]);

const contents: ComputedRef<SideAction[]> = computed(() => [
    {
        icon: 'icon-texte',
        type: 'text',
        label: i18n.global.t('sidebar.content.text'),
        tooltip: i18n.global.t('sidebar.content.textTooltip'),
    },
    {
        icon: 'icon-video',
        type: 'video',
        label: i18n.global.t('sidebar.content.video'),
        tooltip: i18n.global.t('sidebar.content.videoTooltip'),
    },
    {
        icon: 'icon-audio',
        type: 'audio',
        label: i18n.global.t('sidebar.content.audio'),
        tooltip: i18n.global.t('sidebar.content.audioTooltip'),
    },
]);

export const standardActions = computed(() => [...questions.value, ...contents.value]);

export const standardPages: ComputedRef<SideAction[]> = computed(() => [
    {
        icon: 'icon-texte',
        type: 'text',
        label: i18n.global.t('sidebar.content.text'),
        tooltip: i18n.global.t('sidebar.content.textTooltip'),
    },
    {
        icon: 'icon-video',
        type: 'video',
        label: i18n.global.t('sidebar.content.video'),
        tooltip: i18n.global.t('sidebar.content.videoTooltip'),
    },
    {
        icon: 'icon-audio',
        type: 'audio',
        label: i18n.global.t('sidebar.content.audio'),
        tooltip: i18n.global.t('sidebar.content.audioTooltip'),
    },
    {
        icon: 'icon-question',
        type: 'question',
        label: i18n.global.t('sidebar.pages.question'),
        tooltip: i18n.global.t('sidebar.pages.questionTooltip'),
    },
    {
        icon: 'icon-condition',
        type: 'condition',
        label: i18n.global.t('sidebar.pages.conditions'),
        tooltip: i18n.global.t('sidebar.pages.conditionsTooltip'),
    },
    {
        icon: 'icon-condition-legacy',
        type: 'legacy-condition',
        label: i18n.global.t('sidebar.pages.conditionsLegacy'),
        tooltip: i18n.global.t('sidebar.pages.conditionsTooltip'),
    },
    {
        icon: 'icon-modele',
        type: 'model',
        label: i18n.global.t('sidebar.pages.model'),
        tooltip: i18n.global.t('sidebar.pages.modelTooltip'),
    },
    {
        icon: 'icon-badge',
        type: 'badge',
        label: i18n.global.t('sidebar.pages.badge'),
        tooltip: i18n.global.t('sidebar.pages.badgeTooltip'),
    },
    {
        icon: 'icon-ouvrir',
        type: 'asset',
        label: 'Assets',
        tooltip: 'Assets here',
    },
]);
