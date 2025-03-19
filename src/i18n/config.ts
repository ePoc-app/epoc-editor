import { createI18n } from 'vue-i18n';
import { frMessages } from './fr';

export const i18n = createI18n({
    locale: 'fr',
    fallbackLocale: 'en',
    messages: {
        fr: frMessages,
    },
});
