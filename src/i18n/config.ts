import { createI18n } from 'vue-i18n';
import { frMessages } from './fr';
import { enMessages } from './en';

export const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        fr: frMessages,
        en: enMessages,
    },
});
