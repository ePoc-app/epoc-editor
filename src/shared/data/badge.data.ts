import env from '@/src/shared/utils/env';
const iconsPath = env.isDev ? '/img/badge/icon' : 'img/badge/icon';

export const defaultBadgeIcons = [
    `${iconsPath}/audio.svg`,
    `${iconsPath}/check.svg`,
    `${iconsPath}/condition.svg`,
    `${iconsPath}/cup.svg`,
    `${iconsPath}/puzzle.svg`,
    `${iconsPath}/question.svg`,
    `${iconsPath}/star.svg`,
    `${iconsPath}/video.svg`
];