import Store from 'electron-store';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';
import { readFileSync } from 'node:original-fs';

const electronStore = new Store();
const isDev = process.env.IS_DEV === 'true';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const translationsPath = isDev ? path.join(__dirname, '../..') : process.resourcesPath;
// const translationPath = path.join(translationsPath, 'i18n/en/translation.json');
// const translationData = await readFile(translationPath, 'utf8');
// const translations = JSON.parse(translationData);

const translations = {
    en: JSON.parse(readFileSync(path.join(translationsPath, 'i18n/en/translation.json'), 'utf8')),
};

/**
 * Get translation for a given key
 * @param {string} key - Translation key (e.g., 'menu.app.label')
 * @returns {string} - Translated string or key if not found
 */
export function t(key) {
    const lang = electronStore.get('settings.locale') || 'en';
    const translationFile = translations[lang] || translations.en;

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
}

/**
 * Wait for all promise to have resolve
 * @param promises
 * @returns {Promise<Awaited<unknown>[]>}
 */
export function waitAll(promises) {
    return Promise.all(promises);
}

/**
 * Wait a certain amount of time (in milliseconds)
 * @param {number} ms
 * @returns {Promise<unknown>}
 */
export function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Converts an event listener that fire once to a promise
 * @param target Element on which to add the listener
 * @param event Event name
 * @returns {Promise<unknown>}
 */
export function waitEvent(target, event) {
    return new Promise((resolve) => {
        target.once(event, () => {
            resolve();
        });
    });
}
