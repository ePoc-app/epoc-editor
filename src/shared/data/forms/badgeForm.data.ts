import { Form } from '@/src/shared/interfaces';
import { badgeButtons } from './formButtons.data';
import { i18n } from '@/src/i18n/config';

const { t } = i18n.global;

export const customBadgeForm: Form = {
    type: 'badge',
    name: 'Paramètres du badge',
    icon: 'icon-badge',
    buttons: badgeButtons,
    fields: [
        {
            inputs: [
                {
                    id: 'title',
                    type: 'text',
                    label: t('forms.node.title'),
                    value: '',
                    placeholder: t('forms.type'),
                },
                {
                    id: 'icon',
                    type: 'icon-picker',
                    label: t('forms.badge.icon'),
                    value: '',
                    placeholder: t('forms.badge.updateIcon'),
                },
            ],
        },
        {
            name: t('forms.badge.obtention'),
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
            name: t('forms.badge.presentation'),
            inputs: [
                {
                    id: 'description',
                    type: 'textarea',
                    label: '',
                    value: '',
                    placeholder: t('forms.badge.presentationPlaceholder'),
                },
            ],
        },
    ],
};

export const badgeForms: Form[] = [customBadgeForm];
