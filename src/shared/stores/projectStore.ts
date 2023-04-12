import { defineStore } from 'pinia';
import { Edge, MarkerType, Node, useVueFlow } from '@vue-flow/core';
import { useEditorStore } from '@/src/shared/stores/editorStore';
import { Chapter } from '@epoc/epoc-types/dist/v1';
import { EpocV1 } from '@/src/shared/classes/epoc-v1';
import { NodeElement, SideAction } from '@/src/shared/interfaces';
import { nextTick, watch } from 'vue';

const {nodes, onConnect, addNodes, addEdges, findNode, setNodes, setEdges, setTransform} = useVueFlow({id: 'main'});
const editorStore = useEditorStore();

interface ProjectState {
    elements: (Node | Edge)[];
    flow: {
        edges: Edge[],
        nodes: Node[],
        position: [number, number],
        zoom: number
    };
}

export const useProjectStore = defineStore('project', {
    state: (): ProjectState => ({
        elements: [epoc, add, mainEdge],
        flow: null
    }),
    actions: {
        setFlow(flow) {
            this.flow = flow;
            this.restore();
        },
        restore() {
            if (this.flow) {
                const [x = 0, y = 0] = this.flow.position;
                setNodes(this.flow.nodes);
                setEdges(this.flow.edges);
                setTransform({x, y, zoom: this.flow.zoom || 0});
            } else {
                this.elements = [epoc, add, mainEdge];
            }
        },
        setEpocNodeData(epoc: EpocV1) {
            const ePocValues = this.elements[0].data.formValues;
            ePocValues.id = epoc.id;
            ePocValues.title = epoc.title;
            ePocValues.image = epoc.image;
            ePocValues.objectives = epoc.objectives;
            ePocValues.summary = epoc.summary;
            ePocValues.teaser = epoc.teaser;
            ePocValues.thumbnail = epoc.thumbnail;
            ePocValues.version = epoc.version;
            ePocValues.certificateScore = epoc.certificateScore;
            ePocValues.authors = Object.values(epoc.authors);
            ePocValues.chapterParameter = epoc.parameters.chapterParameter;
        },
        addChapter(chapterId?: string, chapter?: Chapter) {
            const chapters = nodes.value.filter(node => node.type === 'chapter');
            const data = {
                action: {icon: 'icon-chapitre', type: 'chapter'},
                formType: 'chapter',
                formValues: {},
                title: 'Chapitre ' + (chapters.length + 1),
                contentId: uid()
            };
            if (chapterId && chapter) {
                data.contentId = chapterId;
                data.formValues = {
                    title: chapter.title,
                    objectives: chapter.objectives
                };
            }
            const newChapter: Node = {
                id: (nodes.value.length + 1).toString(),
                type: 'chapter',
                position: {x: 0, y: (chapters.length + 1) * 200},
                data,
                draggable: false,
                deletable: true,
                selectable: true
            };

            addNodes([newChapter]);

            return newChapter;
        },
        createNodeLinkedNextNode(element, contentElements) {
            const position = {
                x: element.position.x + 150,
                y: element.position.y
            };
            const pageNode: Node = {
                id: contentElements[0].parentId,
                type: 'content',
                data: {
                    elements: contentElements,
                    formType: 'screen',
                    formValues: {},
                    type: 'template',
                    contentId: uid()
                },
                position: position,
                deletable: false
            };
            const edge : Edge = {
                id: editorStore.generateId(),
                source: element.id,
                target: contentElements[0].parentId,
                type: 'default',
                updatable: true,
                style: {stroke: '#384257', strokeWidth: 2.5},
                markerEnd: {type: MarkerType.ArrowClosed, color: '#384257'}
            };
            addNodes([pageNode]);
            addEdges([edge]);
            return pageNode;
        },
        createNodeFromElement(position, element: NodeElement) {

            const id = editorStore.generateId();

            element.parentId = id;

            const newNode = {
                id: id,
                type: 'content',
                data: {
                    elements: [element],
                    formType: 'screen',
                    formValues: {},
                    type: 'question',
                    contentId: uid()
                },
                position,
                deletable: false
            };

            addNodes([newNode]);

            editorStore.addElementToPage(id, element.action);

            // align node position after drop, so it's centered to the mouse
            nextTick(() => {
                const node = findNode(newNode.id);
                const stop = watch(
                    () => node.dimensions,
                    (dimensions) => {
                        if (dimensions.width > 0 && dimensions.height > 0) {
                            node.position = {
                                x: node.position.x - node.dimensions.width / 2,
                                y: node.position.y - node.dimensions.height / 2
                            };
                            stop();
                        }
                    },
                    {deep: true, flush: 'post'},
                );
            });

            //? Conflicts with vue draggable on node edge
            document.querySelectorAll('.node .ghost').forEach((ghost) => {
                ghost.remove();
            });
        },
        addNode(position, actions: SideAction[]) {

            const questionTypes = ['qcm', 'dragdrop', 'reorder', 'swipe', 'list'];
            const elements: NodeElement[] = [];

            const id = editorStore.generateId();

            actions.forEach((action) => {
                elements.push({
                    id: editorStore.generateId(),
                    action: action,
                    formType: action.type,
                    formValues: {},
                    parentId: id,
                    contentId: editorStore.generateContentId()
                });
            });

            const type = elements[0].action.type;
            const isQuestion = questionTypes.includes(type);
            const isCondition = type === 'condition';
            
            const finalType = isQuestion ? 'question' : (isCondition ? 'condition' : 'element');


            const newNode = {
                id: id,
                type: 'content',
                data: {
                    type: finalType,
                    elements: elements,
                    contentId: uid(),
                    formType: 'screen',
                    formValues: {}
                },
                position,
                deletable: true
            };

            addNodes([newNode]);

            actions.forEach((action) => {
                editorStore.addElementToPage(id, action);
            });

            // align node position after drop, so it's centered to the mouse
            nextTick(() => {
                const node = findNode(newNode.id);
                const stop = watch(
                    () => node.dimensions,
                    (dimensions) => {
                        if (dimensions.width > 0 && dimensions.height > 0) {
                            node.position = {
                                x: node.position.x - node.dimensions.width / 2,
                                y: node.position.y - node.dimensions.height / 2
                            };
                            stop();
                        }
                    },
                    {deep: true, flush: 'post'},
                );
            });

            //? Conflicts with vue draggable on node edge
            document.querySelectorAll('.node .ghost').forEach((ghost) => {
                ghost.remove();
            });
        }
    }
});

const epoc: Node = {
    id: '1',
    type: 'epoc',
    data: {action: {icon: 'icon-epoc', type: 'epoc'}, formType: 'epoc', formValues: {}},
    position: {x: 0, y: 0},
    draggable: false,
    deletable: false
};

const add: Node = {
    id: '2',
    type: 'add',
    position: {x: 32, y: 128},
    draggable: false,
    deletable: false
};

const mainEdge: Edge = {
    id: 'mainEdge',
    source: '1',
    target: '2',
    style: {stroke: '#CDD3E0', strokeWidth: 2.5},
    selectable: false,
    deletable: false
};

function uid() {
    const firstNumber = (Math.random() * 46656) | 0;
    const secondNumber = (Math.random() * 46656) | 0;
    const firstPart = ('000' + firstNumber.toString(36)).slice(-3);
    const secondPart = ('000' + secondNumber.toString(36)).slice(-3);
    return firstPart + secondPart;
}

// Update position of add chapter button based on number of chapters
const projectStore = useProjectStore();
projectStore.$subscribe(() => {
    const chapters = projectStore.elements.filter(node => node.type === 'chapter');
    const addNode = findNode('2');
    if (addNode) {
        addNode.position.y = 200 * chapters.length + 125;
    }
});

onConnect((params) => {
    addEdges([{
        ...params,
        updatable: true,
        style: {stroke: '#384257', strokeWidth: 2.5},
        markerEnd: {type: MarkerType.ArrowClosed, color: '#384257'}
    }]);
});