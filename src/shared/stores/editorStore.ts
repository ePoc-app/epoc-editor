import { defineStore } from 'pinia';
import { ePocProject, Form, NodeElement, PageModel, SideAction } from '@/src/shared/interfaces';
import { toRaw } from 'vue';
import { GraphNode, useVueFlow } from '@vue-flow/core';

import { formsModel, questions, standardPages } from '@/src/shared/data';

const { nodes, findNode } = useVueFlow({ id: 'main' });

type uid = string;

interface EditorState {
    loading:boolean;
    recentProjects: ePocProject[];
    currentProject: ePocProject;
    saving: boolean;
    loadingPreview: boolean;
    exporting:boolean;
    questionMenu: boolean;
    modelMenu: boolean;
    pageModels: PageModel[];
    validationModal: boolean;
    formPanel: Form | null;
    openedElementId: uid | null;
    openedNodeId: uid | null;
    questions: SideAction[];
    standardPages: SideAction[];
    undoStack: [];
    redoStack: [];
    draggedElement: {
        type?: 'nodeElement' | 'sideAction';
        //? SideAction as an array to manage the template the same way
        element?: NodeElement | SideAction[];
        source?: {
            parentId: string,
            index: number
        }
    };
}

export const useEditorStore = defineStore('editor', {
    state: (): EditorState => ({
        loading: false,
        recentProjects: [],
        currentProject: {filepath: null, workdir: null, name: null, modified: null},
        saving: false,
        loadingPreview: false,
        exporting: false,
        questionMenu: false,
        modelMenu: false,
        pageModels: [],
        validationModal: false,
        formPanel: null,
        openedElementId: null,
        openedNodeId: null,
        questions: questions,
        standardPages: standardPages,
        undoStack: [],
        redoStack: [],
        draggedElement: {},
    }),
    
    getters: {
        getCurrentGraphNode(): GraphNode | null  {
            const nodeId = this.openedNodeId ?? this.openedElementId;
            return nodeId ? findNode(nodeId) : null;
        }
    },

    actions: {
        dismissModals(): void {
            this.questionMenu = false;
            this.modelMenu = false;
        },

        openFormPanel(id: string, formType: string, formValues, nodeId?: string): void {
            this.openedElementId = id;
            this.openedNodeId = nodeId;

            //? To be sure the view is notified of closing / reopening
            this.formPanel = null;
            setTimeout(() => { 
                this.formPanel = formsModel.find(form => form.type === formType);
            });

            nodes.value.forEach(node => node.selected = node.id === this.openedElementId);
        },

        closeFormPanel(): void {
            this.formPanel = null;
            this.openedElementId = null;
        },

        closeValidationModal(): void {
            this.validationModal = false;
        },

        openValidationModal(): void {
            this.validationModal = true;
        },

        undo() {
            // @todo
            console.log('todo undo', this.undoStack.length);
        },

        redo() {
            // @todo
            console.log('todo redo');
        },

        savePageModel(model: SideAction[]): boolean {
            const modelExist = this.pageModels.some(pageModel => JSON.stringify(pageModel.actions) === JSON.stringify(model));
            if(modelExist) return false;
            this.pageModels.push({ actions: model });
            return true;
        },

        openPage(): void {
            const parentNode = findNode(this.openedParentId);
            this.openFormPanel(parentNode.id, parentNode.data.formType, parentNode.data.formValues);
        },
    }
});
