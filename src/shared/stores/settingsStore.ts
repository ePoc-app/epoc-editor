import { defineStore } from 'pinia';
import { editorService } from '@/src/shared/services';
import { Settings } from '@/src/shared/interfaces';

interface SettingsState {
    settings?: Settings
}

export const useSettingsStore = defineStore('settings', {
    state: (): SettingsState => ({
        settings: undefined
    }),

    actions: {
        init() {
            editorService.fetchSettings();
        },

        sendSettings() {
            editorService.setSettings(JSON.parse(JSON.stringify(this.settings)));
        },

        setSettings(spellcheck: boolean) {
            this.settings.spellcheck = spellcheck;

            this.sendSettings();
        }
    }
})
