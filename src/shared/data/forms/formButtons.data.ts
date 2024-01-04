import { FormButton } from '@/src/shared/interfaces';
import env from '@/src/shared/utils/env';

export const baseButtons = [
    { label: 'Supprimer', icon: 'icon-supprimer', action: 'delete' },
    { label: 'Ajouter un badge', icon: 'icon-plus', action: 'add-badge' },
];

export const pageButtons: FormButton[] = env.isDev
    ? [
          ...baseButtons,
          { label: 'Dupliquer la page', icon: 'icon-plus', action: 'duplicate-page' },
          { label: 'Sauvegarder le modèle', icon: 'icon-modele', action: 'save-model' },
      ]
    : [...baseButtons, { label: 'Dupliquer la page', icon: 'icon-plus', action: 'duplicate-page' }];

export const activityButtons: FormButton[] = env.isDev
    ? [
          ...baseButtons,
          { label: "Dupliquer l'activité", icon: 'icon-plus', action: 'duplicate-page' },
          { label: 'Sauvegarder le modèle', icon: 'icon-modele', action: 'save-model' },
      ]
    : [...baseButtons, { label: "Dupliquer l'activité", icon: 'icon-plus', action: 'duplicate-page' }];

export const contentButtons: FormButton[] = env.isDev
    ? [
          ...baseButtons,
          { label: 'Revenir à la page', icon: 'icon-ecran', action: 'back-to-page' },
          { label: "Dupliquer l'élément", icon: 'icon-plus', action: 'duplicate-element' },
      ]
    : [...baseButtons];

export const badgeButtons: FormButton[] = [
    { label: 'Supprimer', icon: 'icon-supprimer', action: 'delete-badge' },
    { label: "Revenir à l'ePoc", icon: 'icon-epoc', action: 'back-to-epoc' },
];
