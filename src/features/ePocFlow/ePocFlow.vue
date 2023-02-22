<script setup lang="ts">
import { VueFlow, useVueFlow, MarkerType, ConnectionMode } from '@vue-flow/core';
import { markRaw, nextTick, watch } from 'vue';
import ScreenNode from './nodes/ScreenNode.vue';
import CustomConnectContent from './edges/CustomConnectContent.vue';
import { SideAction, NodeElement, Form } from '@/src/shared/interfaces';
import { useEditorStore } from '@/src/shared/stores';
import ChapterNode from './nodes/ChapterNode.vue';
import ePocNode from './nodes/ePocNode.vue';
import AddChapterNode from './nodes/AddChapterNode.vue';

const { nodes, addNodes, addEdges, onConnect, vueFlowRef, project, findNode }  = useVueFlow({ id: 'main' });

//TODO: find a way to ignore the onConnect here and only use the snap to handle one
onConnect((params) => {
    addEdges([{...params, updatable: true, style: { stroke: '#384257', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#384257'} }]);
});

const editorStore = useEditorStore();

const nodeTypes = {
    content: markRaw(ScreenNode),
    chapter: markRaw(ChapterNode),
    epoc: markRaw(ePocNode),
    add: markRaw(AddChapterNode), 
};

const epoc = {
    id: '1',
    type: 'epoc',
    position: { x: 0, y: 0 },
    draggable: false,
};

const add = {
    id: '2',
    type: 'add',
    position: { x: 33, y: editorStore.chapters.length * 200 + 125 },
    events: {
        click: () => {
            addChapter();
        }
    },
    draggable: false
};

const mainEdge = {
    id: 'mainEdge',
    source: '1',
    target: '2',
    style: { stroke: '#CDD3E0', strokeWidth: 2.5 }
};


const elements = [epoc, add, mainEdge];

const onDrop = (event) => {
    const { left, top } = vueFlowRef.value.getBoundingClientRect();

    const position = project({
        x: event.clientX - left,
        y: event.clientY - top,
    });

    const sideActionData = event.dataTransfer.getData('sideAction');
    const elementData = event.dataTransfer.getData('element');
    
    if(sideActionData) {
        const isScreen = event.dataTransfer.getData('isScreen');
        const actions = JSON.parse(sideActionData);
    
        // not sure if this is better than transfer the isScreen in all the case and use it as a boolean here
        if(isScreen === 'true') {
            addNode(position, actions);
        } else {
            addNode(position, [actions]);
        }
    } else if(elementData) {
        const element = JSON.parse(elementData);
        createNodeFromElement(position, element);

        const source = JSON.parse(event.dataTransfer.getData('source'));
        console.log('source', source);
        console.log('removed with native drag');
        editorStore.removeElementFromScreen(source.index, source.parent);
    }

};

function createNodeFromElement(position, element: NodeElement) {

    const id = editorStore.generateId();
    const form = editorStore.getForm('screen');

    element.parentId = id;

    const newNode = {
        id: id,
        type: 'content',
        data: { elements: [element], readyToDrop: false, animated: false, form: form, type: 'question' },
        position,
        events: {
            click: () => {
                openForm(id, form);
            }
        }
    };

    editorStore.addElementToScreen(form, element.action, -1);

    addNodes([newNode]);

    // align node position after drop, so it's centered to the mouse
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
}

function addNode(position, actions: SideAction[]) {

    const questionTypes = ['qcm', 'dragdrop', 'reorder', 'swipe', 'list'];
    let elements: NodeElement[] = [];
    
    const id = editorStore.generateId();
    const form = editorStore.getForm('screen');
    
    actions.forEach((action) => {
        elements.push({
            id: editorStore.generateId(),
            action: action,
            form: editorStore.getForm(action.type),
            parentId: id
        });
        editorStore.addElementToScreen(form, action, -1);
    });

    //? For the V0 the templates aren't editable
    const type = questionTypes.includes(elements[0].action.type) ? 'question' : 'template';

    const newNode = {
        id: id,
        type: 'content',
        // Put animated: nodeIcons.length === 1 when implementing v2
        data: { elements: elements, readyToDrop: false, animated: false, form: form, type: type },
        position,
        events: {
            click: () => {
                openForm(id, form);
            }
        }
    };
       
    addNodes([newNode]);
    
    // align node position after drop, so it's centered to the mouse
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
}
function addChapter() {
    const chapterLength = editorStore.chapters.length;

    const newElement: NodeElement = {
        id: editorStore.generateId(),
        action: {
            type: 'chapter',
            icon: 'icon-chapitre'
        },
        form: editorStore.getForm('chapter'),
    };

    editorStore.chapters.push(newElement);

    const newChapter = {
        id: (nodes.value.length + 1).toString(),
        type: 'chapter',
        position: { x: 0, y: (chapterLength + 1) * 200 },
        data: { elements: newElement, title: 'Chapitre ' + (chapterLength + 1)},
        draggable: false,
    };
    
    addNodes([newChapter]);
    findNode('2').position.y += 200;
}

function openForm(id: string, form: Form) {
    editorStore.openFormPanel(id, form);
}

</script>

<template>
    <VueFlow
        v-model="elements"
        auto-connect
        fit-view-on-init
        :max-zoom="1.5"
        :min-zoom=".7"
        :node-extent="[[0, 0], [1300, 1300]]"
        :translate-extent="[[-500, -500], [1800, 1800]]"
        :node-types="nodeTypes"
        :connection-mode="ConnectionMode.Strict"
        :edge-updater-radius="30"
        @drop="onDrop"
        @dragover.prevent
        @dragenter.prevent
    >
        <template #node-custom="{ id, data }">
            <ScreenNode :id="id" :data="data" />
        </template>
        <template #node-chapter="{ id, data }">
            <ChapterNode :id="id" :data="data" />
        </template>
        <template #node-epoc="{ id, data }">
            <ePocNode :id="id" :data="data" />
        </template>
        <template #node-add="{ id, data }">
            <AddChapterNode :id="id" :data="data" />
        </template>
        <template #connection-line="{ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }">
            <CustomConnectContent 
                :source-x="sourceX"
                :source-y="sourceY"
                :targetX="targetX"
                :targetY="targetY"
                :source-position="sourcePosition"
                :target-position="targetPosition"
            />
        </template>
    </VueFlow>
</template>

<style scoped lang="scss">
.node {
    margin: auto;
}
</style>