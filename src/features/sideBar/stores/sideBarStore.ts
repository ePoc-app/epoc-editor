import { defineStore } from 'pinia';
import { SideAction } from '@/src/shared/interfaces';
import { questions, standardPages } from '@/src/shared/data';
import type { ComputedRef } from 'vue';

export type MenuType = 'question' | 'model' | 'badge';

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
}

export const useSideBarStore = defineStore('sideBar', {
    state: (): SideBarState => ({
        activeMenu: { isOpen: false, type: 'question' },
        draggedElement: null,
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
    },

    actions: {
        toggleMenu(type: MenuType) {
            if (this.activeMenu.type === type) {
                this.activeMenu.isOpen = !this.activeMenu.isOpen;
            } else {
                this.activeMenu = { isOpen: true, type };
            }
        },

        closeMenu() {
            this.activeMenu.isOpen = false;
        },

        setDraggedElement(element: SideAction[]) {
            this.draggedElement = { type: 'sideAction', element };
        },

        clearDraggedElement() {
            this.draggedElement = null;
        },
    },
});
