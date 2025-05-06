
const Store = require('electron-store');
const path = require('path');
const electronStore = new Store();
const isDev = process.env.IS_DEV === 'true';
const translationsPath = isDev ? path.join(__dirname, '../..') : process.resourcesPath;
const translations = require(`${translationsPath}/i18n/en/translation.json`);

/**
 * Get translation for a given key
 * @param {string} key - Translation key (e.g., 'menu.app.label')
 * @returns {string} - Translated string or key if not found
 */
module.exports.t = function (key) {
    const lang = electronStore.get('settings.locale') || 'en';
    const translationFile = require(`${translationsPath}/i18n/${lang}/translation.json`);

    // Split key by dots and traverse the translation object
    const keys = key.split('.');
    let result = translationFile;

    for (const k of keys) {
        if (result && Object.prototype.hasOwnProperty.call(result, k)) {
            result = result[k];
        } else {
            // If key not found, try English as fallback
            result = translations;
            for (const k of keys) {
                if (result && Object.prototype.hasOwnProperty.call(result, k)) {
                    result = result[k];
                } else {
                    return key; // Return the key itself if translation not found
                }
            }
            return result;
        }
    }
    return result;
};

/**
 * Wait for all promise to have resolve
 * @param promises
 * @returns {Promise<Awaited<unknown>[]>}
 */
module.exports.waitAll = function (promises) {
    return Promise.all(promises);
};

/**
 * Wait a certain amount of time (in milliseconds)
 * @param {number} ms
 * @returns {Promise<unknown>}
 */
module.exports.wait = function (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Converts an event listener that fire once to a promise
 * @param target Element on which to add the listener
 * @param event Event name
 * @returns {Promise<unknown>}
 */
module.exports.waitEvent = function (target, event) {
    return new Promise((resolve) => {
        target.once(event, () => {
            resolve();
        });
    });
};
