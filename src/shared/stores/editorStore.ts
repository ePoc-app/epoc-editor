import { defineStore } from 'pinia';
import { ePocProject, Form, NodeElement, PageModel, SideAction, Condition } from '@/src/shared/interfaces';
import { GraphNode, useVueFlow } from '@vue-flow/core';
import { formsModel, questions, standardPages } from '@/src/shared/data';

const {
    nodes,
    findNode,
    getTransform,
    setTransform } = useVueFlow({ id: 'main' });

type uid = string;

interface EditorState {
    // Landing page
    loading:boolean;
    recentProjects: ePocProject[];
    currentProject: ePocProject;

    // Save
    saving: boolean;
    loadingPreview: boolean;
    exporting:boolean;

    // Graph
    openedElementId: uid | null;
    openedNodeId: uid | null;
    draggedElement: {
        type?: 'nodeElement' | 'sideAction';
        //? SideAction as an array to manage the template the same way
        element?: NodeElement | SideAction[];
        source?: {
            parentId: string,
            index: number
        }
    };
    openedBadgeId: string | null;

    // Panel/ Menu
    questionMenu: boolean;
    modelMenu: boolean;
    formPanel: {
        form: Form | null;
        width: number;
    }


    // Data
    pageModels: PageModel[];
    questions: SideAction[];
    standardPages: SideAction[];

    // Modal
    conditionModal: boolean;
    validationModal: boolean;
    iconModal: boolean;
    hamburgerMenu: boolean;

    // Mode
    selectNodeMode: boolean;
    tempConditions: Condition[];
    editingConditions: boolean;
}

export const useEditorStore = defineStore('editor', {
    state: (): EditorState => ({
        // Landing page
        loading: false,
        recentProjects: [],
        currentProject: {filepath: null, workdir: null, name: null, modified: null},

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
        formPanel: {
            form: null,
            width: 0
        },

        // Data
        pageModels: [],
        questions: questions,
        standardPages: standardPages,

        // Modal
        conditionModal: false,
        validationModal: false,
        iconModal: false,
        hamburgerMenu: false,

        // Mode
        selectNodeMode: false,
        tempConditions: [],
        editingConditions: false,
    }),
    
    getters: {
        getCurrentGraphNode(): GraphNode | null  {
            const nodeId = this.openedNodeId ?? this.openedElementId;
            return nodeId ? findNode(nodeId) : null;
        },

        getEpocNode(): GraphNode {
            return findNode('1');
        },

        openedFormType(): string | null {
            return this.formPanel.form?.type ?? null;
        }
    },

    actions: {
        reset(): void {
            this.draggedElement = {};
            this.openedElementId = null;
            this.openedNodeId = null;
            this.formPanel.form = null;
            this.validationModal = false;
            this.questionMenu = false;
            this.modelMenu = false;
        },

        dismissModals(): void {
            this.questionMenu = false;
            this.modelMenu = false;
            this.hamburgerMenu = false;
        },
        
        openBadgeFormPanel(id: string, _type: 'custom' | 'meta', scrollPosY?: number): void {
            this.openedBadgeId = id;
            this.formPanel.form = null;
            this.openedNodeId = null;
            this.openedElementId = null;

            setTimeout(() => {
                this.formPanel.form = formsModel.find(form => form.type === 'badge');
            });

            if(scrollPosY) this.scrollFormPanel(scrollPosY);
        },
        
        openFormPanel(id: string, formType: string, options?: { nodeId?: string, scrollPosY?: number, centerNode?: boolean }): void {
            const { nodeId, scrollPosY, centerNode } = options ?? {};
            
            this.openedElementId = id;
            this.openedNodeId = nodeId;
            this.openedBadgeId = null;

            //? To be sure the view is notified of closing / reopening
            this.formPanel.form = null;
            setTimeout(() => {
                this.formPanel.form = formsModel.find(form => form.type === formType);
            });

            if(scrollPosY) this.scrollFormPanel(scrollPosY);

            nodes.value.forEach(node => node.selected = node.id === this.openedElementId);
            
            if(!centerNode) return;
            
            const node = nodeId ? findNode(nodeId) : findNode(id);
            if(!node) return;
            
            const { zoom } = getTransform();
            const { x, y } = node.position;
            
            setTransform({ x: -x * zoom + 200, y: -y * zoom + 200, zoom});
            
        },
        
        scrollFormPanel(posY: number): void {
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
                if(formPanel) formPanel.scrollTop = posY;
            });
        },

        closeValidationModal(): void {
            this.validationModal = false;
        },

        openValidationModal(): void {
            this.validationModal = true;
        },

        savePageModel(model: SideAction[]): boolean {
            const modelExist = this.pageModels.some((pageModel: PageModel) => JSON.stringify(pageModel.actions) === JSON.stringify(model));
            if(modelExist) return false;
            this.pageModels.push({ actions: model });
            return true;
        },

        openPage(): void {
            const parentNode = findNode(this.openedNodeId);
            this.openFormPanel(parentNode.id, parentNode.data.formType);
        },

        openEpoc(): void {
            this.openFormPanel('1', 'epoc');
        },

        enterSelectNodeMode(): void {
            this.selectNodeMode = true;
        },

        exitSelectNodeMode(): void {
            this.selectNodeMode = false;
        },
        
        resetTempCondition(index: number) {
            this.tempConditions[index].verb = '';
            this.tempConditions[index].value = '';
        }
    }
});
