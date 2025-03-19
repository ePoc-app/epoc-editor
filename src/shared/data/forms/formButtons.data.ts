import { FormButton } from '@/src/shared/interfaces';
import env from '@/src/shared/utils/env';
import { i18n } from '@/src/i18n/config';

const { t } = i18n.global;

export const baseButtons = [
    { label: t('global.delete'), icon: 'icon-supprimer', action: 'delete' },
    { label: t('forms.buttons.addBadge'), icon: 'icon-plus', action: 'add-badge' },
];

export const pageButtons: FormButton[] =
    env.isDev ?
        [
            ...baseButtons,
            { label: t('forms.buttons.duplicatePage'), icon: 'icon-plus', action: 'duplicate-page' },
            { label: t('forms.buttons.saveModel'), icon: 'icon-modele', action: 'save-model' },
        ]
    :   [...baseButtons, { label: t('forms.buttons.duplicatePage'), icon: 'icon-plus', action: 'duplicate-page' }];

export const activityButtons: FormButton[] =
    env.isDev ?
        [
            ...baseButtons,
            { label: t('forms.buttons.duplicateEvaluation'), icon: 'icon-plus', action: 'duplicate-page' },
            { label: t('forms.buttons.saveModel'), icon: 'icon-modele', action: 'save-model' },
        ]
    :   [
            ...baseButtons,
            { label: t('forms.buttons.duplicateEvaluation'), icon: 'icon-plus', action: 'duplicate-page' },
        ];

export const contentButtons: FormButton[] =
    env.isDev ?
        [
            ...baseButtons,
            { label: t('forms.buttons.backToPage'), icon: 'icon-ecran', action: 'back-to-page' },
            { label: t('forms.buttons.duplicateElement'), icon: 'icon-plus', action: 'duplicate-element' },
        ]
    :   [...baseButtons];

export const badgeButtons: FormButton[] = [
    { label: t('global.delete'), icon: 'icon-supprimer', action: 'delete-badge' },
    { label: t('forms.buttons.backToEpoc'), icon: 'icon-epoc', action: 'back-to-epoc' },
];
