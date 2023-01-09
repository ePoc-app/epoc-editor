import { defineStore } from 'pinia';
import { Screen } from '../interfaces';

interface EpocState {
    screensModel: {
        standard: Screen[],
        personnal: Screen[],
        personnalSelected: boolean
    },
}

export const useEpocStore = defineStore('epoc', {
    state: (): EpocState => ({
        screensModel: {
            standard: standardScreens,
            personnal: [],
            personnalSelected: false
        },
    }),

    getters: {
        getSelectedScreens() {
            return this.screensModel.personnalSelected ? this.screensModel.personnal : this.screensModel.standard;
        },
    },
});

const standardScreens: Screen[] = [
    {
        title: 'titre écran',
        actions: [
            {
                icon: 'icon-texte',
                type: 'text'
            },
            {
                icon: 'icon-video',
                type: 'video'
            },
            {
                icon: 'icon-qcm'
            },
        ]
    },
    {
        title: 'titre écran',
        actions: [
            {
                icon: 'icon-texte',
                type: 'text'
            },
            {
                icon: 'icon-condition',
                type: 'condition'
            },
        ]
    },
    {
        title: 'titre écran',
        actions: [
            {
                icon: 'icon-texte',
                type: 'text'
            },
            {
                icon: 'icon-video',
                type: 'video'
            },
        ]
    },
    {
        title: 'titre écran',
        actions: [
            {
                icon: 'icon-texte',
                type: 'text'
            },
            {
                icon: 'icon-video',
                type: 'video'
            },
            {
                icon: 'icon-qcm'
            },
        ]
    },
    {
        title: 'titre écran',
        actions: [
            {
                icon: 'icon-texte',
                type: 'text'
            },
            {
                icon: 'icon-video',
                type: 'video'
            },
        ]
    },
    {
        title: 'titre écran',
        actions: [
            {
                icon: 'icon-texte',
                type: 'text'
            },
            {
                icon: 'icon-video',
                type: 'video'
            },
        ]
    },
    {
        title: 'titre écran',
        actions: [
            {
                icon: 'icon-texte',
                type: 'text'
            },
            {
                icon: 'icon-video',
                type: 'video'
            },
        ]
    },
    
];