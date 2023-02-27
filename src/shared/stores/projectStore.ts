import { defineStore } from 'pinia';
import { Edge, Node, useVueFlow } from '@vue-flow/core';
import { useEditorStore } from '@/src/shared/stores/editorStore';
import { NodeElement } from '@/src/shared/interfaces';

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
            console.log('restore', this.flow);
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
        
            const newElement: NodeElement = {
                id: editorStore.generateId(),
                action: {
                    type: 'chapter',
                    icon: 'icon-chapitre'
                },
                form: editorStore.getForm('chapter')
            };

            const newChapter = {
                id: (nodes.value.length + 1).toString(),
                type: 'chapter',
                position: { x: 0, y: (chapters.length + 1) * 200 },
                data: { elements: newElement, title: 'Chapitre ' + (chapters.length + 1)},
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
