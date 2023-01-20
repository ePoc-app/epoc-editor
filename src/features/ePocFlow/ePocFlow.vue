<script setup lang="ts">
import { VueFlow, useVueFlow, Panel, PanelPosition, MarkerType, ConnectionMode } from '@vue-flow/core';
import { markRaw, nextTick, watch } from 'vue';
import ScreenNode from './nodes/ScreenNode.vue';
import CustomConnectContent from './edges/CustomConnectContent.vue';
import { SideAction, NodeElement, Form } from '@/src/shared/interfaces';
import { useEditorStore } from '@/src/shared/stores';
import ChapterNode from './nodes/ChapterNode.vue';
import ePocNode from './nodes/ePocNode.vue';
import AddChapterNode from './nodes/AddChapterNode.vue';

const { nodes, addNodes, addEdges, onConnect, vueFlowRef, project, findNode, setNodes, setEdges }  = useVueFlow();

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

//? Use this to detect intersections(for creating screen);
// onNodeDrag(({ intersections }) => {
//     const intersectionIds = intersections.map((intersection) => intersection.id);

//     getNodes.value.forEach((node) => {
//         const isIntersecting = intersectionIds.includes(node.id);
//     });
// });

const onDrop = (event) => {
    const { left, top } = vueFlowRef.value.getBoundingClientRect();

    const position = project({
        x: event.clientX - left,
        y: event.clientY - top,
    });

    const data = event.dataTransfer.getData('sideAction');
    const isScreen = event.dataTransfer.getData('isScreen');

    const actions = JSON.parse(data);

    // not sure if this is better than transfer the isScreen in all the case and use it as a boolean here
    if(isScreen === 'true') {
        addNode(position, actions);
    } else {
        if(!addToExistingScreen(actions)) {
            addNode(position, [actions]);
        }
    }

};

function addNode(position, actions: SideAction[]) {

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
    });

    const newNode = {
        id: id,
        type: 'content',
        // Put animated: nodeIcons.length === 1 when implementing v2
        data: { elements: elements, readyToDrop: false, animated: false, form: form },
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

function addToExistingScreen(action : SideAction):boolean {
    for(let node of nodes.value) {
        if(node.data.readyToDrop) {
            node.data.elements.push({
                id: editorStore.generateId(),
                action: action,
                form: editorStore.getForm(action.type),
                parentId: node.id
            });
            node.data.readyToDrop = false;
            document.querySelector('#node'+node.id).classList.remove('node-animate');
            return true;
        }
    }
    return false;
}

//Temporary function
function onDelete() {
    setNodes([epoc, add]);
    setEdges([mainEdge]);
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
        <Panel :position="PanelPosition.TopRight" class="save-restore-controls">
            <button style="background-color: #ff0000; padding: 1rem; border-radius: 8px; border: none; cursor: pointer; font-size: 1.2rem;" @click="onDelete">Delete all</button>
        </Panel>
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