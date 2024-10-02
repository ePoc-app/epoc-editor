import { defineStore } from 'pinia';
import { Edge, FlowExportObject, MarkerType, Node, useVueFlow } from '@vue-flow/core';

const { nodes, onConnect, addEdges, findNode, setNodes, setEdges, setTransform } = useVueFlow('main');

interface GraphState {
    elements: (Node | Edge)[];
    flow: FlowExportObject;
}

//! Not really sure if this store is up to date at all time with the graph data
export const useGraphStore = defineStore('graph', {
    state: (): GraphState => ({
        elements: [epoc(), add, mainEdge],
        flow: null,
    }),

    actions: {
        setFlow(flow: FlowExportObject) {
            this.flow = flow;
            this.restore();
        },
        restore() {
            if (this.flow) {
                const [x = 0, y = 0] = this.flow.position;
                setNodes(this.flow.nodes);
                setEdges(this.flow.edges);
                setTransform({ x, y, zoom: this.flow.zoom || 0 });
            } else {
                this.elements = [epoc(), add, mainEdge];
            }
        },
    },
});

const epoc = (): Node => {
    return {
        id: '1',
        type: 'epoc',
        data: {
            action: { icon: 'icon-epoc', type: 'epoc' },
            formType: 'epoc',
            formValues: { id: `E-${(Math.random() + 1).toString(36).substring(7).toUpperCase()}` },
        },
        position: { x: 0, y: 0 },
        draggable: false,
        deletable: false,
    };
};

const add: Node = {
    id: '2',
    type: 'add',
    position: { x: 34, y: 128 },
    draggable: false,
    deletable: false,
};

const mainEdge: Edge = {
    id: 'mainEdge',
    source: '1',
    target: '2',
    style: { stroke: '#CDD3E0', strokeWidth: 2.5 },
    selectable: false,
    deletable: false,
};

// Update position of add chapter button based on number of chapters
const graphStore = useGraphStore();
graphStore.$subscribe(() => {
    const chapters = nodes.value.filter((node) => node.type === 'chapter');
    const lastChapter = chapters.sort((a, b) => a.data.index - b.data.index).pop();
    const addPositionY = lastChapter ? lastChapter.position.y + 128 : 128;
    const addNode = findNode('2');
    if (addNode) {
        addNode.position.y = addPositionY;
    }
});

onConnect((params) => {
    addEdges([
        {
            ...params,
            updatable: true,
            style: { stroke: '#384257', strokeWidth: 2.5 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#384257' },
        },
    ]);
});
