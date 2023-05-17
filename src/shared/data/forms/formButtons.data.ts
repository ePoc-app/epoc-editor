import { FormButton } from '@/src/shared/interfaces';

export const baseButtons = [{ label: 'Supprimer', icon: 'icon-supprimer', action: 'delete' }];

export const pageButtons: FormButton[] = [
    ...baseButtons,
    { label: 'Dupliquer la page', icon: 'icon-plus', action: 'duplicate-page' },
    { label: 'Lancer l\'aperçu ici', icon: 'icon-play', action: 'launch-preview' },
    { label: 'Sauvegarder le modèle', icon: 'icon-modele', action: 'save-model' }
];

export const contentButtons: FormButton[] = [
    ...baseButtons,
    { label: 'Revenir à la page', icon: 'icon-ecran', action: 'back-to-page' },
    { label : 'Dupliquer l\'élément', icon: 'icon-plus', action: 'duplicate-element' },
];