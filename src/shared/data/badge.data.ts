import env from '@/src/shared/utils/env';
import { ElementType, VerbKey, Verbs } from '@/src/shared/interfaces';
import { i18n } from '@/i18n/config';
import { computed, ComputedRef } from 'vue';

export const iconsPath = env.isDev ? '/img/badge/icon' : 'img/badge/icon';

export const defaultBadgeIcons = ['audio', 'check', 'condition', 'cup', 'puzzle', 'question', 'star', 'video'];

export const verbs: ComputedRef<Verbs> = computed(() => ({
    started: { label: i18n.global.t('verbs.started'), valueType: 'boolean' },
    completed: { label: i18n.global.t('verbs.completed'), valueType: 'boolean' },
    viewed: { label: i18n.global.t('verbs.viewed'), valueType: 'boolean' },
    read: { label: i18n.global.t('verbs.read'), valueType: 'boolean' },
    played: { label: i18n.global.t('verbs.played'), valueType: 'boolean' },
    watched: { label: i18n.global.t('verbs.watched'), valueType: 'boolean' },
    listened: { label: i18n.global.t('verbs.listened'), valueType: 'boolean' },
    attempted: { label: i18n.global.t('verbs.attempted'), valueType: 'boolean' },
    scored: { label: i18n.global.t('verbs.scored'), valueType: 'number' },
    passed: { label: i18n.global.t('verbs.passed'), valueType: 'boolean' },
}));

export const elementVerbs: Record<ElementType, VerbKey[]> = {
    chapter: ['started'],
    page: ['viewed'],
    html: ['read'],
    video: ['played', 'watched'],
    audio: ['played', 'listened'],
    activity: ['started', 'completed', 'scored'],
    question: ['attempted', 'passed', 'scored'],
};
