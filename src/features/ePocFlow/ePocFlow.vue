<script setup lang="ts">
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { markRaw, nextTick, watch } from 'vue';
import ContentNode from './nodes/ContentNode.vue';
import CustomConnectContent from './edges/CustomConnectContent.vue';
import { SideAction, NodeElement } from '../../shared/interfaces';
import { useEditorStore } from '../../shared/stores';

const { nodes, addNodes, addEdges, onConnect, vueFlowRef, project, findNode }  = useVueFlow();

onConnect((params) => addEdges([{...params, updatable: true, style: { stroke: '#384257', strokeWidth: 2.5 }}]));

const editorStore = useEditorStore();

const nodeTypes = {
    content: markRaw(ContentNode)
};

const elements = [];

//? Use this to detect interesctions(for creating screen);
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

    console.log(data);

    const actions = JSON.parse(data);

    if(actions.length > 1) {
        addNode(position, actions);
    } else {
        if(!addToExistingScreen(actions)) {
            addNode(position, [actions]);
        }
    }

};

function addNode(position, actions: SideAction[]) {

    let elements: NodeElement[] = [];

    
    const id= (nodes.value.length + 1).toString();
    
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
        data: { elements: elements, readyToDrop: false, animated: false, title: 'Screen' },
        position,
        events: {
            click: () => {
                console.log('node' + id + ' clicked');
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
</script>

<template>
    <VueFlow
        v-model="elements"
        auto-connect
        fit-view-on-init
        :max-zoom="1.5"
        :min-zoom=".7"
        :node-extent="[[0, 0], [1300, 1300]]"
        :node-types="nodeTypes"
        @drop="onDrop"
        @dragover.prevent
        @dragenter.prevent
    >
        <MiniMap />
        <template #node-custom="{ id, data }">
            <ContentNode :id="id" :data="data" />
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