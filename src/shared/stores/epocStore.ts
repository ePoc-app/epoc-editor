import { defineStore } from 'pinia';
import { Screen } from '@/src/shared/interfaces';

interface EpocState {
    screensModel: {
        personnal: Screen[],
        personnalSelected: boolean
    },
}

export const useEpocStore = defineStore('epoc', {
    state: (): EpocState => ({
        //? will the personnal screens be linked to the editor or the ePoc
        screensModel: {
            personnalSelected: false,
            personnal: []
        },
    }),

    getters: {
        getSelectedScreens() {
            return this.screensModel.personnalSelected ? this.screensModel.personnal : this.screensModel.standard;
        },
    },
});