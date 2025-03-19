import env from '@/src/shared/utils/env';
import { ElementType, VerbKey, Verbs } from '@/src/shared/interfaces';
import { i18n } from '@/src/i18n/config';

const { t } = i18n.global;

export const iconsPath = env.isDev ? '/img/badge/icon' : 'img/badge/icon';

export const defaultBadgeIcons = ['audio', 'check', 'condition', 'cup', 'puzzle', 'question', 'star', 'video'];

export const verbs: Verbs = {
    started: { label: t('verbs.started'), valueType: 'boolean' },
    completed: { label: t('verbs.completed'), valueType: 'boolean' },
    viewed: { label: t('verbs.viewed'), valueType: 'boolean' },
    read: { label: t('verbs.read'), valueType: 'boolean' },
    played: { label: t('verbs.played'), valueType: 'boolean' },
    watched: { label: t('verbs.watched'), valueType: 'boolean' },
    listened: { label: t('verbs.listened'), valueType: 'boolean' },
    attempted: { label: t('verbs.attempted'), valueType: 'boolean' },
    scored: { label: t('verbs.scored'), valueType: 'number' },
    passed: { label: t('verbs.passed'), valueType: 'boolean' },
};

export const elementVerbs: Record<ElementType, VerbKey[]> = {
    chapter: ['started'],
    page: ['viewed'],
    html: ['read'],
    video: ['played', 'watched'],
    audio: ['played', 'listened'],
    activity: ['started', 'completed', 'scored'],
    question: ['attempted', 'passed', 'scored'],
};
