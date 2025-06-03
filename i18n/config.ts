import { createI18n } from 'vue-i18n';

async function loadTranslations() {
    const fr = await import('./fr/translation.json', { assert: { type: 'json' } });
    const en = await import('./en/translation.json', { assert: { type: 'json' } });

    return {
        fr,
        en,
    };
}

async function initializeI18n() {
    const translations = await loadTranslations();

    const i18n = createI18n({
        locale: 'en',
        fallbackLocale: 'en',
        messages: translations,
    });

    return i18n;
}

export const i18n = await initializeI18n();
