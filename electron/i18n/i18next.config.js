const i18n = require('i18next');
const Backend = require('i18next-node-fs-backend');
const path = require('path');

i18n.use(Backend).init({
    backend: {
        loadPath: path.join(__dirname, './{{lng}}/{{ns}}.json'),
    },
    fallbackLng: 'fr',
    lng: 'fr',
    supportedLngs: ['en', 'fr'], // Add supported languages
    interpolation: {
        escapeValue: false,
    },
    debug: process.env.NODE_ENV === 'development',
});

module.exports = i18n;
