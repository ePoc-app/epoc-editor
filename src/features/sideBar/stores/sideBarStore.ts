import { defineStore } from 'pinia';
import { SideAction } from '@/src/shared/interfaces';
import { questions, standardPages } from '@/src/shared/data';
import type { ComputedRef } from 'vue';

export type MenuType = 'question' | 'model' | 'badge' | 'asset';

interface MenuState {
    isOpen: boolean;
    type: MenuType;
}

interface DraggedElement {
    type: 'sideAction';
    element: SideAction[];
}

interface SideBarState {
    activeMenu: MenuState;
    draggedElement: DraggedElement | null;
    questionMenu: boolean;
    modelMenu: boolean;
    badgeMenu: boolean;
    assetMenu: boolean;
}

export const useSideBarStore = defineStore('sideBar', {
    state: (): SideBarState => ({
        activeMenu: { isOpen: false, type: 'question' },
        draggedElement: null,
        questionMenu: false,
        modelMenu: false,
        badgeMenu: false,
        assetMenu: false,
    }),

    getters: {
        isMenuOpen(): boolean {
            return this.activeMenu.isOpen;
        },

        currentMenuType(): MenuType {
            return this.activeMenu.type;
        },

        questions(): ComputedRef<SideAction[]> {
            return questions;
        },

        standardPages(): ComputedRef<SideAction[]> {
            return standardPages;
        },

        sideMenuOpen(): boolean {
            return this.modelMenu || this.badgeMenu;
        },
    },

    actions: {
        toggleMenu(type: MenuType) {
            if (this.activeMenu.type === type) {
                this.activeMenu.isOpen = !this.activeMenu.isOpen;
            } else {
                this.activeMenu = { isOpen: true, type };
            }

            // Update menu states
            this.questionMenu = type === 'question' ? !this.questionMenu : false;
            this.modelMenu = type === 'model' ? !this.modelMenu : false;
            this.badgeMenu = type === 'badge' ? !this.badgeMenu : false;
            this.assetMenu = type === 'asset' ? !this.assetMenu : false;
        },

        setDraggedElement(element: SideAction[]) {
            this.draggedElement = { type: 'sideAction', element };
        },

        clearDraggedElement() {
            this.draggedElement = null;
        },

        dismissModals() {
            this.questionMenu = false;
            this.modelMenu = false;
            this.badgeMenu = false;
            this.assetMenu = false;
        },
    },
});
