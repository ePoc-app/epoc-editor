import { defineStore } from 'pinia';
import { Edge, Node, useVueFlow } from '@vue-flow/core';
import { useEditorStore } from '@/src/shared/stores/editorStore';

const { nodes, addNodes, findNode, setNodes, setEdges, setTransform  }  = useVueFlow({ id: 'main' });
const editorStore = useEditorStore();

interface ProjectState {
    elements: (Node|Edge)[];
    flow: {
        edges: Edge[],
        nodes: Node[],
        position: [number, number],
        zoom: number
    }
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
        restore () {
            if (this.flow) {
                const [x = 0, y = 0] = this.flow.position;
                setNodes(this.flow.nodes);
                setEdges(this.flow.edges);
                setTransform({ x, y, zoom: this.flow.zoom || 0 });
            } else {
                this.elements = [epoc, add, mainEdge];
            }
        },
        addChapter() {
            const chapters = nodes.value.filter(node => node.type === 'chapter');

            const newChapter = {
                id: (nodes.value.length + 1).toString(),
                type: 'chapter',
                position: { x: 0, y: (chapters.length + 1) * 200 },
                data: { action: { icon: 'icon-chapitre', type: 'chapter' }, formType: 'chapter', formValues: {} , title: 'Chapitre ' + (chapters.length + 1), contentId: uid()},
                draggable: false,
            };

            addNodes([newChapter]);
            findNode('2').position.y += 200;
        }
    }
});

const epoc : Node = {
    id: '1',
    type: 'epoc',
    data: { action: { icon: 'icon-epoc', type: 'epoc' }, formType: 'epoc', formValues: {} },
    position: { x: 0, y: 0 },
    draggable: false,
};

const add : Node = {
    id: '2',
    type: 'add',
    position: { x: 33, y: 125 },
    draggable: false
};

const mainEdge : Edge = {
    id: 'mainEdge',
    source: '1',
    target: '2',
    style: { stroke: '#CDD3E0', strokeWidth: 2.5 },
    selectable: false,
    deletable: false,
};

function uid() {
    const firstNumber = (Math.random() * 46656) | 0;
    const secondNumber = (Math.random() * 46656) | 0;
    const firstPart = ('000' + firstNumber.toString(36)).slice(-3);
    const secondPart = ('000' + secondNumber.toString(36)).slice(-3);
    return firstPart + secondPart;
}