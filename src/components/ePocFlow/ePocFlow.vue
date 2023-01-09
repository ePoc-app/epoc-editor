<script setup lang="ts">
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { markRaw, nextTick, watch } from 'vue';
import ContentNode from './nodes/ContentNode.vue';
import CustomConnectContent from './edges/CustomConnectContent.vue';
import { SideAction } from '../../shared/interfaces';

const { nodes, addNodes, addEdges, onConnect, vueFlowRef, project, findNode }  = useVueFlow();

onConnect((params) => addEdges([{...params, updatable: true, style: { strokeWidth: 2.5 }}]));

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

    const actions = JSON.parse(data);


    if(actions.length > 1) {
        addNode(position, actions);
    } else {
        if(!addToExistingScreen(actions)) {
            addNode(position, actions);
        }
    }

};

function addNode(position, actions) {
   
    // nodeIcons contains all the icons of actions
    const nodeIcons = actions.length > 1 ? actions.map((action) => { return action.icon; }) : [actions.icon];

    const newNode = {
        id: (nodes.value.length + 1).toString(),
        type: 'content',
        data: { icons: nodeIcons, readyToDrop: false, animated: nodeIcons.length === 1 },
        position,
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
            node.data.icons.push(action.icon);
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
        :node-types="nodeTypes"
        @drop="onDrop"
        @dragover.prevent
        @dragenter.prevent
    >
        <MiniMap />
        <template #node-custom="{ id, data }">
            <ContentNode :id="id" :data="data" />
        </template>
        <template #connection-line="{ sourceX, sourceY, targetX, targetY }">
            <CustomConnectContent 
                :source-x="sourceX"
                :source-y="sourceY"
                :targetX="targetX"
                :targetY="targetY"
            />
        </template>
        <template #edge-custom="props">
            <ContentEdge :props="props" />
        </template>
    </VueFlow>
</template>

<style scoped lang="scss">
.node {
    margin: auto;
}
</style>