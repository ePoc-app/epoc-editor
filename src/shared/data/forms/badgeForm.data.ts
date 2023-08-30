import { Form } from '@/src/shared/interfaces';
import { badgeButtons } from './formButtons.data';

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
                    label: 'Titre',
                    value: '',
                    placeholder: 'Saisissez...',
                },
                {
                    id: 'icon',
                    type: 'icon-picker',
                    label: 'Icône de couverture', 
                    value: '',
                    placeholder: 'Modifier l\'icône',
                },
            ]
        },
        {
            name: 'Conditions d\'obtention du badge',
            inputs: [
                {
                    id:'conditions',
                    type: 'badge-conditions',
                    label: '',
                    value: [],
                },
            ]
        },
        {
            name: 'Présentation du badge',
            inputs: [
                {
                    id: 'description',
                    type: 'html',
                    label: '',
                    value: '',
                    placeholder: 'Saisissez une présentation du badge',
                }
            ]
        }
    ]
};

export const badgeForms: Form[] = [customBadgeForm];