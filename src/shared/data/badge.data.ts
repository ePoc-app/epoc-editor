import env from '@/src/shared/utils/env';
import {ElementType, VerbKey, Verbs} from "@/src/shared/interfaces";
export const iconsPath = env.isDev ? '/img/badge/icon' : 'img/badge/icon';

export const defaultBadgeIcons = [
    'audio',
    'check',
    'condition',
    'cup',
    'puzzle',
    'question',
    'star',
    'video'
];

export const verbs: Verbs = {
    'started': { label: 'Commencé', valueType: 'boolean' },
    'completed': { label: 'Terminé', valueType: 'boolean' },
    'viewed': { label: 'Vu', valueType: 'boolean' },
    'read': { label: 'Lu', valueType: 'boolean' },
    'played': { label: 'Joué', valueType: 'boolean' },
    'watched': { label: 'Regardé', valueType: 'boolean' },
    'listened': { label: 'Écouté', valueType: 'boolean' },
    'attempted': { label: 'Tenté', valueType: 'boolean' },
    'scored': { label: 'Obtenu un score de', valueType: 'number' },
    'passed': { label: 'Réussi', valueType: 'boolean' },
};

export const elementVerbs: Record<ElementType, VerbKey[]> = {
    'chapter': ['started'],
    'page': ['viewed'],
    'html': ['read'],
    'video': ['played', 'watched'],
    'audio': ['played', 'listened'],
    'activity': ['started', 'completed', 'scored'],
    'question': ['attempted', 'passed', 'scored']
};
