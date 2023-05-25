import { FormButton } from '@/src/shared/interfaces';

export const baseButtons = [{ label: 'Supprimer', icon: 'icon-supprimer', action: 'delete' }];

export const pageButtons: FormButton[] = [
    ...baseButtons,
    { label: 'Dupliquer la page', icon: 'icon-plus', action: 'duplicate-page' },
    { label: 'Sauvegarder le modèle', icon: 'icon-modele', action: 'save-model' },
];

export const activityButtons: FormButton[] = [
    ...baseButtons,
    { label: 'Dupliquer l\'activité', icon: 'icon-plus', action: 'duplicate-page' },
    { label: 'Sauvegarder le modèle', icon: 'icon-modele', action: 'save-model', disabled: true},
    { label: 'Question simple', icon: 'icon-question', action: 'simple-question', disabled: (data) => { return data.elements.length > 1; } }
];

export const contentButtons: FormButton[] = [
    ...baseButtons,
    { label: 'Revenir à la page', icon: 'icon-ecran', action: 'back-to-page' },
    { label : 'Dupliquer l\'élément', icon: 'icon-plus', action: 'duplicate-element' },
];