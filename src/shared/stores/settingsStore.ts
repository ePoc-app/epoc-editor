import { defineStore } from 'pinia';
import { editorService } from '@/src/shared/services';
import { Settings } from '@/src/shared/interfaces';
import { i18n } from '@/i18n/config';

interface SettingsState {
    settings?: Settings;
    initialized: boolean;
}

export const useSettingsStore = defineStore('settings', {
    state: (): SettingsState => ({
        settings: undefined,
        initialized: false,
    }),

    actions: {
        init() {
            editorService.fetchSettings();
            this.initialized = true;
        },

        initSettings(settings: Settings) {
            this.settings = settings;
            if (this.settings.locale && this.settings.locale !== i18n.global.locale) {
                i18n.global.locale = this.settings.locale;
            }
        },

        sendSettings() {
            editorService.setSettings(JSON.parse(JSON.stringify(this.settings)));
        },

        setSettings(spellcheck: boolean) {
            this.settings.spellcheck = spellcheck;
            this.settings.locale = i18n.global.locale;

            this.sendSettings();
        },
    },
});
