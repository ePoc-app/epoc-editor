import { defineStore } from 'pinia';

type BadgeElement = { [key: string]: string[] };
interface ProjectState {
   customIcons: string[];
   badgeElements: BadgeElement;
}

export const useProjectStore = defineStore('project', {
    state: (): ProjectState => ({
        customIcons: [],
        badgeElements: {}
    }),

    actions: {
        addCustomIcon(icon: string) {
            this.customIcons.push(icon);
        }
    }
});