import { createI18n } from 'vue-i18n';
// @ts-expect-error // json files not resolved
import fr from './fr/translation.json';
// @ts-expect-error // json files not resolved
import en from './en/translation.json';

export const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        fr,
        en,
    },
});
