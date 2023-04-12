import { defineStore } from 'pinia';
import { ePocProject, Form, FormButton, NodeElement, PageModel, SideAction } from '@/src/shared/interfaces';
import { nextTick, toRaw, watch } from 'vue';
import { applyEdgeChanges, applyNodeChanges, GraphNode, useVueFlow } from '@vue-flow/core';

import { formsModel, questions, standardScreen } from '@/src/shared/data/form.data';

const { findNode, nodes, addNodes, project, vueFlowRef, edges } = useVueFlow({ id: 'main' });

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
    formPanel: Form;
    openedElementId: uid | null;
    openedParentId: uid | null;
    questions: SideAction[];
    standardScreens: SideAction[];
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
        openedParentId: null,
        questions: questions,
        standardScreens: standardScreen,
        undoStack: [],
        redoStack: [],
        draggedElement: {},
    }),
    
    getters: {
        getCurrentGraphNode(): GraphNode | null  {
            const nodeId = this.openedParentId ?? this.openedElementId;
            return findNode(nodeId);
        }
    },
    
    actions: {
        dismissModals(): void {
            this.questionMenu = false;
            this.modelMenu = false;
        },

        openFormPanel(id: string, formType: string, formValues, parentId?: string): void {
            this.openedElementId = id;
            this.openedParentId = parentId;

            //? To be sure the view is notified of closing / reopening
            this.formPanel = null;
            setTimeout(() => { 
                this.formPanel = structuredClone(formsModel.find(form => form.type === formType));
            });

            nodes.value.forEach(node => node.selected = node.id === this.openedElementId);
        },

        closeFormPanel(): void {
            this.formPanel = null;
            this.openedElementId = null;
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

            if(parentId || !nodeToDelete) {
                const parentNode = findNode(parentId ?? this.openedParentId);
                if(parentNode) {
                    parentNode.data.elements.forEach((value, index) => {
                        if(value.id === id) {
                            this.removeElementFromScreen(index, parentId ?? this.openedParentId);
                        }
                    });
                }
            } else {
                applyNodeChanges([{ id: nodeToDelete.id, type: 'remove' }], nodes.value);

                if(nodeToDelete.type === 'chapter') {
                    const chapters = nodes.value.filter(node => node.type === 'chapter');
                    chapters.forEach(chapter => {
                        if(chapter.id <= nodeToDelete.id) return;
                        
                        chapter.position = { x: 0, y: chapter.position.y - 200 };
                        chapter.data.title = `Chapitre ${Number(chapter.data.title.split(' ')[1]) - 1}`;
                    });
                }
            }
            this.closeFormPanel();
        },

        isNodeDeletable(id: string): boolean {
            const undeletableIds= ['1', '2'];
            return !undeletableIds.includes(id);
        },

        deleteSelectedNodes(): void {
            const selectedNodes = nodes.value.filter(node => node.selected && this.isNodeDeletable(node.id));
            const isChild = Boolean(this.openedParentId);
            
            //? Chapter nodes can't be selected but can be active
            const activeNode = isChild ? findNode(this.openedParentId) : findNode(this.openedElementId);
            if(activeNode && this.isNodeDeletable(activeNode.id)) selectedNodes.push(activeNode);

            if(isChild) {
                this.deleteElement(this.openedElementId, this.openedParentId);
            } else {
                selectedNodes.forEach(node => this.deleteElement(node.id));
            }
            this.validationModal = false;
        },

        deleteValidation(): void {
            const selectedNodes = nodes.value.filter(node => node.selected && this.isNodeDeletable(node.id));
            const isChild = Boolean(this.openedParentId);

            //? Chapter nodes can't be selected but can be active
            const activeNode = isChild ? findNode(this.openedParentId) : findNode(this.openedElementId);
            if(activeNode && this.isNodeDeletable(activeNode.id)) selectedNodes.push(activeNode);

            const selectedEdges = edges.value.filter(edge => edge.selected);

            if(selectedNodes.length > 0 || isChild) {
                this.validationModal = true;
            } else if(selectedEdges.length > 0) {
                selectedEdges.forEach(edge => {
                    applyEdgeChanges([{ id: edge.id, type: 'remove' }], edges.value);
                });
            }
        },

        addElementToPage(nodeId: string, action: SideAction, index?: number): void {
            const node = findNode(nodeId);

            if(!node.data.formValues.components) node.data.formValues.components = [];

            if(index !== undefined) {
                node.data.formValues.components.splice(index, 0, { action });
            } else {
                node.data.formValues.components.push({ action });
            }
        },

        //? The parameter nodeMoved is used when openedParentId is not usable
        removeElementFromScreen(index: number, parentNodeId, nodeMoved?: boolean): void {
            this.closeFormPanel();

            const node = findNode(parentNodeId);
            node.data.elements.splice(index, 1);

            if(this.openedParentId || nodeMoved) {
                node.data.formValues.components.splice(index, 1);
            }

            if(!node.data.elements.length) {
                this.deleteElement(parentNodeId);
            }
        },

        changeElementOrder(startIndex: number, finalIndex: number, parentNodeId: string): void {
            const node = findNode(parentNodeId);

            const [tmpElem] = node.data.elements.splice(startIndex, 1);
            node.data.elements.splice(finalIndex, 0, tmpElem);

            const [tmpValues] = node.data.formValues.components.splice(startIndex, 1);
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

        generateContentId(): string {
            const firstNumber = (Math.random() * 46656) | 0;
            const secondNumber = (Math.random() * 46656) | 0;
            const firstPart = ('000' + firstNumber.toString(36)).slice(-3);
            const secondPart = ('000' + secondNumber.toString(36)).slice(-3);
            return firstPart + secondPart;
        },

        getFormButtons(): FormButton[] {
            const buttons: FormButton[] = [];
            
            if(this.formPanel.type === 'epoc') return buttons;

            buttons.push({ label: 'Supprimer',icon: 'icon-supprimer',action: 'delete' });

            if(this.formPanel.type === 'chapter') return buttons;

            const isChild = Boolean(this.openedParentId);

            if(!isChild) {
                buttons.push(
                    { label: 'Dupliquer la page', icon: 'icon-plus', action: 'duplicate-screen' },
                    { label: 'Lancer l\'aperçu ici', icon: 'icon-play', action: 'launch-preview' },
                    { label: 'Sauvegarder le modèle', icon: 'icon-modele', action: 'save-model' }
                );
            } else {
                buttons.push(
                    { label: 'Revenir à la page', icon: 'icon-back', action: 'back-to-screen' },
                    { label : 'Dupliquer l\'élément', icon: 'icon-plus', action: 'duplicate-element' },
                );
            }

            return buttons;
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

        duplicateScreen(): void {
            const node = findNode(this.openedElementId);
            const newElements = [];

            const nodeId = this.generateId();

            for(const element of node.data.elements) {
                const newElement = JSON.parse(JSON.stringify(toRaw(element)));
                newElement.id = this.generateId();
                newElement.parentId = nodeId;
                newElements.push(newElement);
            }

            const newNode = {
                id: nodeId,
                type: node.type,
                position: { x: node.position.x + 150, y: node.position.y },
                data: {
                    elements: newElements,
                    formType: 'screen',
                    formValues: JSON.parse(JSON.stringify(toRaw(node.data.formValues))),
                    type: node.data.type,
                    contentId: this.generateContentId(),
                    // deletable: false,
                }
            };

            addNodes([newNode]);
            this.closeFormPanel();
        },

        duplicateElement(): void {
            const node = findNode(this.openedParentId);
            const element = node.data.elements.find(element => element.id === this.openedElementId);

            const newElement = JSON.parse(JSON.stringify(toRaw(element)));
            newElement.id = this.generateId();
            newElement.parentId = node.id;

            node.data.elements.push(newElement);
            this.addElementToPage(node.id, newElement.action);
        },

        addNewPage(type: string, pos: { x: number, y: number }): void {
            const types = standardScreen.concat(questions);
            const id = this.generateId();

            const elements: NodeElement[] = [{
                id: this.generateId(),
                action: types.find((value) => value.type === type),
                formType: type,
                formValues: {},
                parentId: id,
                contentId: this.generateContentId(),
            }];

            const { left, top } = vueFlowRef.value.getBoundingClientRect();
            const position = project({ x: pos.x - left, y: pos.y - top });

            const newNode = {
                id,
                type: 'content',
                position,
                data: { type, elements, formType: 'screen', formValues: {}, contentId: id } ,
            };

            addNodes([newNode]);

            nextTick(() => {
                const node = findNode(newNode.id);
                const stop = watch(
                    () => node.dimensions,
                    (dimensions) => {
                        if (dimensions.width > 0 && dimensions.height > 0) {
                            node.position = { x: node.position.x - node.dimensions.width / 2, y: node.position.y - node.dimensions.height / 2 };
                            stop();
                        }
                    },
                    { deep: true, flush: 'post' },
                );
            });

            this.addElementToPage(id, elements[0].action);
        }
    }
});
