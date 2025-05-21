import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { ePocProject, Form, NodeElement, PageModel, SideAction, Condition } from '@/src/shared/interfaces';
import { GraphNode, useVueFlow } from '@vue-flow/core';
import { formsModel, questions, standardPages } from '@/src/shared/data';
import type { ComputedRef } from 'vue';

const { nodes, findNode, getTransform, setTransform } = useVueFlow('main');

type uid = string;

const sideMenus = {
    question: 'questionMenu',
    model: 'modelMenu',
    badge: 'badgeMenu',
};
type SideMenu = keyof typeof sideMenus;

interface EditorState {
    // Landing page
    loading: boolean;
    projectToImport: string | null;
    recentProjects: ePocProject[];
    currentProject: ePocProject;

    // Save
    saving: boolean;
    loadingPreview: boolean;
    exporting: boolean;

    // Graph
    openedElementId: uid | null;
    openedNodeId: uid | null;
    draggedElement: {
        type?: 'nodeElement' | 'sideAction';
        //? SideAction as an array to manage the template the same way
        element?: NodeElement | SideAction[];
        source?: {
            parentId: string;
            index: number;
        };
    };
    openedBadgeId: string | null;

    // Panel/ Menu
    questionMenu: boolean;
    modelMenu: boolean;
    badgeMenu: boolean;
    formPanel: {
        form: Form | null;
        width: number;
    };

    // Data
    pageModels: PageModel[];
    questions: ComputedRef<SideAction[]>;
    standardPages: ComputedRef<SideAction[]>;

    // Modal
    conditionModal: boolean;
    validationModal: boolean;
    iconModal: boolean;
    hamburgerMenu: boolean;

    // Mode
    selectNodeMode: boolean;
    tempConditions: Condition[];
    editingConditions: boolean;

    // Info
    version: string;
    platform: string;
}

export const useEditorStore = defineStore('editor', {
    state: (): EditorState => ({
        // Landing page
        loading: false,
        projectToImport: null,
        recentProjects: [],
        currentProject: { filepath: null, workdir: null, name: null, modified: null },

        // Save
        saving: false,
        loadingPreview: false,
        exporting: false,

        // Graph
        openedElementId: null,
        openedNodeId: null,
        draggedElement: {},
        openedBadgeId: null,

        // Panel/ Menu
        questionMenu: false,
        modelMenu: false,
        badgeMenu: false,
        formPanel: {
            form: null,
            width: 0,
        },

        // Data
        pageModels: [],
        questions,
        standardPages,

        // Modal
        conditionModal: false,
        validationModal: false,
        iconModal: false,
        hamburgerMenu: false,

        // Mode
        selectNodeMode: false,
        tempConditions: [],
        editingConditions: false,

        // Info
        version: '',
        platform: '',
    }),

    getters: {
        getCurrentGraphNode(): GraphNode | null {
            const nodeId = this.openedNodeId ?? this.openedElementId;
            return nodeId ? findNode(nodeId) : null;
        },

        getEpocNode(): GraphNode {
            return findNode('1');
        },

        openedFormType(): string | null {
            return this.formPanel.form?.type ?? null;
        },

        sideMenuOpen(): boolean {
            return this.modelMenu || this.badgeMenu;
        },
    },

    actions: {
        reset() {
            this.draggedElement = {};
            this.openedElementId = null;
            this.openedNodeId = null;
            this.formPanel.form = null;
            this.validationModal = false;
            this.questionMenu = false;
            this.modelMenu = false;
        },

        dismissModals() {
            this.questionMenu = false;
            this.modelMenu = false;
            this.badgeMenu = false;
            this.hamburgerMenu = false;
        },

        openBadgeFormPanel(id: string, _type: 'custom' | 'meta', scrollPosY?: number) {
            this.openedBadgeId = id;
            this.formPanel.form = null;
            this.openedNodeId = null;
            this.openedElementId = null;

            setTimeout(() => {
                this.formPanel.form = formsModel.value.find((form) => form.type === 'badge');
            });

            if (scrollPosY) this.scrollFormPanel(scrollPosY);
        },

        openFormPanel(
            id: string,
            formType: string,
            options?: { nodeId?: string; scrollPosY?: number; centerNode?: boolean }
        ) {
            const { nodeId, scrollPosY, centerNode } = options ?? {};

            this.openedElementId = id;
            this.openedNodeId = nodeId;
            this.openedBadgeId = null;

            this.formPanel.form = null;
            setTimeout(() => {
                this.formPanel.form = formsModel.value.find((form) => form.type === formType);
            });

            if (scrollPosY) this.scrollFormPanel(scrollPosY);

            nodes.value.forEach((node) => (node.selected = node.id === this.openedElementId));

            if (!centerNode) return;

            const node = nodeId ? findNode(nodeId) : findNode(id);
            if (!node) return;

            const { zoom } = getTransform();
            const { x, y } = node.position;

            setTransform({ x: -x * zoom + 200, y: -y * zoom + 200, zoom });
        },

        scrollFormPanel(posY: number) {
            const checkIfPanelReady = (): Promise<void> => {
                return new Promise((resolve) => {
                    const checkInterval = setInterval(() => {
                        if (document.querySelector('.formPanel')) {
                            clearInterval(checkInterval);
                            resolve();
                        }
                    }, 100);
                });
            };

            checkIfPanelReady().then(() => {
                const formPanel = document.querySelector('.formPanel');
                if (formPanel) formPanel.scrollTop = posY;
            });
        },

        closeValidationModal() {
            this.validationModal = false;
        },

        openValidationModal() {
            this.validationModal = true;
        },

        savePageModel(model: PageModel): boolean {
            const modelExist = this.pageModels.some(
                (pageModel) => JSON.stringify(pageModel.actions) === JSON.stringify(model.actions)
            );
            if (modelExist) return false;
            this.pageModels.push(model);
            return true;
        },

        openPage() {
            const parentNode = findNode(this.openedNodeId);
            this.openFormPanel(parentNode.id, parentNode.data.formType);
        },

        openEpoc() {
            this.openFormPanel('1', 'epoc');
        },

        enterSelectNodeMode() {
            this.selectNodeMode = true;
        },

        exitSelectNodeMode() {
            this.selectNodeMode = false;
        },

        resetTempCondition(index: number) {
            this.tempConditions[index].verb = '';
            this.tempConditions[index].value = '';
        },

        toggleSideMenu(type: SideMenu) {
            this.questionMenu = type === 'question' ? !this.questionMenu : false;
            this.modelMenu = type === 'model' ? !this.modelMenu : false;
            this.badgeMenu = type === 'badge' ? !this.badgeMenu : false;
        },
    },
});
