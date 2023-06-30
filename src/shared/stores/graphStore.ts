import { defineStore } from 'pinia';
import { Edge, MarkerType, Node, useVueFlow } from '@vue-flow/core';

const {nodes, onConnect, addEdges, findNode, setNodes, setEdges, setTransform} = useVueFlow({id: 'main'});

interface GraphState {
    elements: (Node | Edge)[];
    flow: {
        edges: Edge[],
        nodes: Node[],
        position: [number, number],
        zoom: number
    };
}

export const useGraphStore = defineStore('project', {
    state: (): GraphState => ({
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
    position: {x: 34, y: 128},
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

// Update position of add chapter button based on number of chapters
const graphStore = useGraphStore();
graphStore.$subscribe(() => {
    const chapters = nodes.value.filter(node => node.type === 'chapter');
    const addPositionY = chapters.length > 0 ? chapters[chapters.length - 1].position.y + 128 : 128;
    const addNode = findNode('2');
    if (addNode) {
        addNode.position.y = addPositionY;
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