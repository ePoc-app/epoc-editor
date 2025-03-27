import { Form } from '@/src/shared/interfaces';
import { badgeButtons } from './formButtons.data';
import { computed, ComputedRef } from 'vue';
import { i18n } from '@/src/i18n/config';

export const customBadgeForm: ComputedRef<Form> = computed(() => {
    return {
        type: 'badge',
        name: i18n.global.t('forms.badge.text'),
        icon: 'icon-badge',
        buttons: badgeButtons.value,
        fields: [
            {
                inputs: [
                    {
                        id: 'title',
                        type: 'text',
                        label: i18n.global.t('forms.node.title'),
                        value: '',
                        placeholder: i18n.global.t('forms.type'),
                    },
                    {
                        id: 'icon',
                        type: 'icon-picker',
                        label: i18n.global.t('forms.badge.icon'),
                        value: '',
                        placeholder: i18n.global.t('forms.badge.updateIcon'),
                    },
                ],
            },
            {
                name: i18n.global.t('forms.badge.obtention'),
                inputs: [
                    {
                        id: 'conditions',
                        type: 'badge-conditions',
                        label: '',
                        value: [],
                    },
                ],
            },
            {
                name: i18n.global.t('forms.badge.presentation'),
                inputs: [
                    {
                        id: 'description',
                        type: 'textarea',
                        label: '',
                        value: '',
                        placeholder: i18n.global.t('forms.badge.presentationPlaceholder'),
                    },
                ],
            },
        ],
    };
});

export const badgeForms: ComputedRef<Form[]> = computed(() => [customBadgeForm.value]);
