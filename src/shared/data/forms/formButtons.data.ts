import { FormButton } from '@/src/shared/interfaces';
import env from '@/src/shared/utils/env';
import { computed, ComputedRef } from 'vue';
import { i18n } from '@/i18n/config';

export const baseButtons: ComputedRef<FormButton[]> = computed(() => {
    return [
        { label: i18n.global.t('global.delete'), icon: 'icon-supprimer', action: 'delete' },
        { label: i18n.global.t('forms.buttons.addBadge'), icon: 'icon-plus', action: 'add-badge' },
    ];
});

export const pageButtons: ComputedRef<FormButton[]> = computed(() => {
    const buttons = [
        ...baseButtons.value,
        { label: i18n.global.t('forms.buttons.duplicatePage'), icon: 'icon-plus', action: 'duplicate-page' },
    ];

    if (env.isDev) {
        buttons.push({ label: i18n.global.t('forms.buttons.saveModel'), icon: 'icon-modele', action: 'save-model' });
    }

    return buttons;
});

export const activityButtons: ComputedRef<FormButton[]> = computed(() => {
    const buttons = [
        ...baseButtons.value,
        {
            label: i18n.global.t('forms.buttons.duplicateEvaluation'),
            icon: 'icon-plus',
            action: 'duplicate-page',
        },
        {
            label: 'Transformer en question simple',
            icon: 'icon-plus',
            action: 'simple-question',
            disabled: (nodeData: any) => nodeData.elements?.length > 1,
        },
    ];

    if (env.isDev) {
        buttons.push({ label: i18n.global.t('forms.buttons.saveModel'), icon: 'icon-modele', action: 'save-model' });
    }

    return buttons;
});

export const contentButtons: ComputedRef<FormButton[]> = computed(() => {
    return env.isDev ?
            [
                ...baseButtons.value,
                { label: i18n.global.t('forms.buttons.backToPage'), icon: 'icon-ecran', action: 'back-to-page' },
                {
                    label: i18n.global.t('forms.buttons.duplicateElement'),
                    icon: 'icon-plus',
                    action: 'duplicate-element',
                },
            ]
        :   [...baseButtons.value];
});

export const badgeButtons: ComputedRef<FormButton[]> = computed(() => {
    return [
        { label: i18n.global.t('global.delete'), icon: 'icon-supprimer', action: 'delete-badge' },
        { label: i18n.global.t('forms.buttons.backToEpoc'), icon: 'icon-epoc', action: 'back-to-epoc' },
    ];
});
