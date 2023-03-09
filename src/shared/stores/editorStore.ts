import { defineStore } from 'pinia';
import { ePocProject, Form, Screen, SideAction } from '@/src/shared/interfaces';
import { toRaw } from 'vue';
import { applyNodeChanges, getConnectedEdges, useVueFlow } from '@vue-flow/core';

import { formsModel, questions, standardScreen } from '@/src/shared/data/form.data';

const { findNode, nodes, edges } = useVueFlow({ id: 'main' });

type uid = string;

interface EditorState {
    loading:boolean;
    recentProjects: ePocProject[];
    currentProject: ePocProject;
    saving: boolean;
    loadingPreview: boolean;
    exporting:boolean;
    floatingMenu: boolean;
    modelMenu: boolean;
    formPanel: Form;
    openedNodeId: uid | null;
    openedParentId: uid | null;
    questions: SideAction[];
    standardScreens: SideAction[];
    undoStack: [];
    redoStack: [];
}

export const useEditorStore = defineStore('editor', {
    state: (): EditorState => ({
        loading: false,
        recentProjects: [],
        currentProject: {filepath: null, workdir: null, name: null, modified: null},
        saving: false,
        loadingPreview: false,
        exporting: false,
        floatingMenu: false,
        modelMenu: false,
        formPanel: null,
        openedNodeId: null,
        openedParentId: null,
        questions: questions,
        standardScreens: standardScreen,
        undoStack: [],
        redoStack: [],
    }),
    
    getters: {
        //* These getters are used to place the separator
        getSideActionsFirstPart(): SideAction[] {
            return this.sideActions.slice(0, -1);
        },
        getSideActionsLastPart(): SideAction[] {
            return this.sideActions.slice(-1);
        },
        //This function is a part of the one used in ePocStore
        getSelectedScreens(): Screen[] {
            return this.standardScreens;
        },
    },
    
    actions: {
        dismissModals(): void {
            this.floatingMenu = false;
            this.modelMenu = false;
        },
        openFormPanel(id: string, formType: string, formValues, parentId?: string): void {
            this.openedNodeId = id;
            this.openedParentId = parentId;
            this.formPanel = null;
            //? To be sure the view is notified of closing / reopening
            setTimeout(() => { 
                this.formPanel = structuredClone(formsModel.find(form => form.type === formType));
            });
        },
        closeFormPanel(): void {
            this.formPanel = null;
            this.openedNodeId = null;
        },
        //generate id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
        generateId(): uid {
            const s4 = () => {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            };
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        },
        //return a copy of the form linked to the type
        getForm(type: string): Form {
            return structuredClone(toRaw(formsModel.find(form => form.type === type)));
        },
        deleteElement(id: string, parentId?: string): void {
            const nodeToDelete = findNode(id);
            if(parentId || !nodeToDelete){
                const parentNode = findNode(parentId ? parentId : this.openedParentId);
                parentNode.data.elements.forEach((value, index) => {
                    if(value.id === id) {
                        this.removeElementFromScreen(index, parentId ? parentId : this.openedParentId);
                    }
                });
            } else {
                const connectedEdges = getConnectedEdges([nodeToDelete], edges.value);
                for(const edge of connectedEdges) {
                    findNode(edge.source).data.isSource = false;
                    findNode(edge.target).data.isTarget = false; 
                }
                applyNodeChanges(
                    [{ id: nodeToDelete.id, type: 'remove' }],
                    nodes.value
                );
                if(nodeToDelete.type === 'chapter') {
                    const chapters = nodes.value.filter(node => node.type === 'chapter');
                    for(const chapter of chapters) {
                        if(chapter.id > nodeToDelete.id) {
                            chapter.position = {x: 0, y: chapter.position.y - 200};
                            chapter.data.title = 'Chapitre ' + (Number(chapter.data.title.split(' ')[1]) - 1);
                        }
                    }
                    findNode('2').position.y -= 200;
                }
            }
            this.closeFormPanel();
        },
        addElementToScreen(nodeId: string, action: SideAction, index?: number) {
            const node = findNode(nodeId);
            if(index) {
                node.data.formValues.components.splice(index, 0, { action: action });
            }
            else {
                if(!node.data.formValues.components) {
                    node.data.formValues.components = [];
                }
                node.data.formValues.components.push({ action: action });
            }
        },
        removeElementFromScreen(index: number, parentNodeId): void {
            const node = findNode(parentNodeId);

            node.data.elements.splice(index, 1);
            node.data.formValues.components.splice(index, 1);
            // node.data.form.fields[1].inputs.splice(index, 1);
            if(node.data.elements.length === 0) {
                const connectedEdges = getConnectedEdges([node], edges.value);
                connectedEdges.forEach(edge => {
                    const source = findNode(edge.source);
                    const target = findNode(edge.target);
                    source.data.isSource = false;
                    target.data.isTarget = false;
                });
                this.deleteElement(parentNodeId);
            }
        },
        changeElementOrder(startIndex: number, finalIndex: number, parentNodeId: string): void {
            const node = findNode(parentNodeId);

            const tmpElem = node.data.elements[startIndex];
            node.data.elements.splice(startIndex, 1);
            node.data.elements.splice(finalIndex, 0, tmpElem);

            const tmpValues = node.data.formValues.components[startIndex];
            node.data.formValues.components.splice(startIndex, 1);
            node.data.formValues.components.splice(finalIndex, 0, tmpValues);
        },
        undo() {
            // @todo
            console.log('todo undo', this.undoStack.length);
        },
        redo() {
            // @todo
            console.log('todo redo');
        },
        generateContentId() {
            const firstNumber = (Math.random() * 46656) | 0;
            const secondNumber = (Math.random() * 46656) | 0;
            const firstPart = ('000' + firstNumber.toString(36)).slice(-3);
            const secondPart = ('000' + secondNumber.toString(36)).slice(-3);
            return firstPart + secondPart;
        }
    }
});

