import { defineStore } from 'pinia';
import { ePocProject, Form, FormButton, NodeElement, Screen, SideAction } from '@/src/shared/interfaces';
import { nextTick, toRaw, watch } from 'vue';
import { applyEdgeChanges, applyNodeChanges, useVueFlow } from '@vue-flow/core';

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
    floatingMenu: boolean;
    modelMenu: boolean;
    validationModal: boolean;
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
        validationModal: false,
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
            nodes.value.forEach((node) => {
                if(node.id !== this.openedNodeId) {
                    node.selected = false;
                }
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
                }
            }
            this.closeFormPanel();
        },
        isNodeDeletable(id: string) {
            console.log('testing if deletable');
            return id !== '1' && id !== '2';
        },
        deleteSelectedNodes(): void {
            const selectedNodes = nodes.value.filter(node => node.selected && node.id !== '1' && node.id !== '2');
            const isChild = Boolean(this.openedParentId);

            //? ChapterNode can't be selected but can be active
            const activeNode = isChild ? findNode(this.openedParentId) : findNode(this.openedNodeId);
            if (activeNode && (activeNode.id !== '1' && activeNode.id !== '2')) {
                selectedNodes.push(activeNode);
            }
            

            for(const node of selectedNodes) {
                this.deleteElement(node.id);
            }
            if(isChild) {
                this.deleteElement(this.openedNodeId, this.openedParentId);
            }
            this.validationModal = false;
        },
        deleteValidation(): void {
            const selectedNodes = nodes.value.filter(node => node.selected && node.id !== '1' && node.id !== '2');
            const isChild = Boolean(this.openedParentId);
            
            //? ChapterNode can't be selected but can be active
            const activeNode = isChild ? findNode(this.openedParentId) : findNode(this.openedNodeId);
            if (activeNode && (activeNode.id !== '1' && activeNode.id !== '2')) {
                selectedNodes.push(activeNode);
            }
            

            if(selectedNodes.length > 0 || isChild) {
                this.validationModal = true;
            } else {
                const selectedEdges = edges.value.filter(edge => edge.selected);
                for(const edge of selectedEdges) {  
                    applyEdgeChanges(
                        [{ id: edge.id, type: 'remove' }],
                        edges.value
                    );
                }
            }
        },
        addElementToScreen(nodeId: string, action: SideAction, index?: number) {
            const node = findNode(nodeId);
            //? can be 0 
            if(index !== undefined) {
                node.data.formValues.components.splice(index, 0, { action: action });
            }
            else {
                if(!node.data.formValues.components) {
                    node.data.formValues.components = [];
                }
                node.data.formValues.components.push({ action: action });
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

            if(node.data.elements.length === 0) {
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
        },
        getFormButtons(): FormButton[] {
            const buttons: FormButton[] = [];
            if(this.formPanel.type !== 'epoc') {
                buttons.push({ label: 'Supprimer',icon: 'icon-supprimer',action: 'delete'});
                if(this.formPanel.type !== 'chapter') {
                    if(!this.openedParentId) {
                        buttons.push({ label: 'Dupliquer la page', icon: 'icon-plus', action: 'duplicate-screen' });
                        buttons.push({ label: 'Lancer l\'aperçu ici', icon: 'icon-play', action: 'launch-preview' });
                    } else {
                        buttons.push({ label: 'Revenir à la page', icon: 'icon-ecran', action: 'open-page' });

                        //? This is temporary
                        if(this.formPanel.type !== 'text' && this.formPanel.type !== 'video') {
                            buttons.push({ label: 'Dupliquer l\'élément', icon: 'icon-plus', action: 'duplicate-element' });
                        }
                    }
                }
            }
            return buttons;
        },
        openPage() {
            const parentNode = findNode(this.openedParentId);
            this.openFormPanel(parentNode.id, parentNode.data.formType, parentNode.data.formValues);
        },
        duplicateScreen() {
            const node = findNode(this.openedNodeId);

            const newElements = [];

            const nodeId = this.generateId();

            for(const element of node.data.elements) {
                const newElement = structuredClone(toRaw(element));
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
                    readyToDrop: false,
                    formType: 'screen',
                    formValues: structuredClone(toRaw(node.data.formValues)),
                    type: node.data.type,
                    contentId: this.generateContentId(),
                    deletable: false
                },
            };

            addNodes([newNode]);
            this.closeFormPanel();
        },
        duplicateElement() {
            const node = findNode(this.openedParentId);

            const element = node.data.elements.find(element => element.id === this.openedNodeId);
            
            //! Structured Clone create error 
            // const newElement = structuredClone(toRaw(element));
            const newElement = JSON.parse(JSON.stringify(toRaw(element)));

            console.log('new Element', newElement);

            newElement.id = this.generateId();
            newElement.parentId = node.id;

            node.data.elements.push(newElement);
            this.addElementToScreen(node.id, newElement.action);
        },
        addNewPage(type: string, pos: { x: number, y: number }) {
            const types = standardScreen.concat(questions);

            const elements: NodeElement[] = [];
            const id = this.generateId();

            elements.push({
                id: this.generateId(),
                action: types.find((value) => value.type === type),
                formType: type,
                formValues: {},
                parentId: id,
                contentId: this.generateContentId(),
            });

            const { left, top } = vueFlowRef.value.getBoundingClientRect();

            const position = project({
                x: pos.x - left,
                y: pos.y - top,
            });

            const newNode = {
                id: id,
                type: 'content',
                data: { type: type, readyToDrop: false, elements: elements, formType: 'screen', formValues: {}, contentId: id },
                position: position,
                deletable: false
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

            this.addElementToScreen(id, elements[0].action);
        }
    }
});