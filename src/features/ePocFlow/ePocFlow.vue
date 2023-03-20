<script setup lang="ts">
import { ConnectionMode, getConnectedEdges, useVueFlow, VueFlow } from '@vue-flow/core';
import { markRaw, onMounted, ref } from 'vue';
import ScreenNode from './nodes/ScreenNode.vue';
import CustomConnectContent from './edges/CustomConnectContent.vue';
import { useEditorStore, useProjectStore } from '@/src/shared/stores';
import ChapterNode from './nodes/ChapterNode.vue';
import ePocNode from './nodes/ePocNode.vue';
import AddChapterNode from './nodes/AddChapterNode.vue';

const { vueFlowRef, project, findNode, findEdge, removeEdges, edges }  = useVueFlow({ id: 'main' });


const editorStore = useEditorStore();
const projectStore = useProjectStore();

const nodeTypes = {
    content: markRaw(ScreenNode),
    chapter: markRaw(ChapterNode),
    epoc: markRaw(ePocNode),
    add: markRaw(AddChapterNode), 
};

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
            projectStore.addNode(position, actions);
        } else {
            projectStore.addNode(position, [actions]);
        }
    } else if(elementData) {
        const element = JSON.parse(elementData);
        projectStore.createNodeFromElement(position, element);

        const source = JSON.parse(event.dataTransfer.getData('source'));

        //? Used to prevent removeEventListener error in Vue Draggable
        setTimeout(() => {
            editorStore.removeElementFromScreen(source.index, source.parent);
        }, 0);
    }

};

onMounted(() => {
    projectStore.restore();
});

//? This is used only to remove
const sourceNode = ref(null);
const targetNode = ref(null);

function changeEdge(event) {
    if(event[0].type === 'select') {
        const edge = findEdge(event[0].id);
        sourceNode.value = findNode(edge.source);
        targetNode.value = findNode(edge.target);
    }if(event[0].type === 'remove') {
        if(sourceNode.value) {
            sourceNode.value.data.isSource = false;
        }
        if(targetNode.value) {
            targetNode.value.data.isTarget = false;
        }
    }
}

function connectEdge(event) {
    const source = findNode(event.source);
    const target = findNode(event.target);
    if(source.data.isSource || target.data.isTarget) {
        const connectedEdges = getConnectedEdges([target], edges.value);
        for(const edge of connectedEdges) {
            if(edge.source === source.id) {
                sourceNode.value = source;
                targetNode.value = null;

                //TODO: find why this is needed
                setTimeout(() => {
                    removeEdges([edge]);
                }, 0);
            }
        }
    }
    source.data.isSource = true;
    target.data.isTarget = true;
}

function update(event) {
    let sourceNode = findNode(event.edge.source);
    let targetNode = findNode(event.edge.target);

    sourceNode.data.isSource = false;
    targetNode.data.isTarget = false;

    event.edge.source = event.connection.source;
    event.edge.target = event.connection.target;

    sourceNode = findNode(event.edge.source);
    targetNode = findNode(event.edge.target);

    sourceNode.data.isSource = true;
    targetNode.data.isTarget = true;
}

function onEdgeclick (event) {
    const marker = event.edge.markerEnd;
    // watch property changed to change color back
    Object.defineProperty(event.edge, 'selected', {
        get() {
            return this._selected;
        },
        set(newValue) {
            this._selected = newValue !== false;
            marker.color = this._selected ? '#00B3E9' : '#384257';
        }
    });
}

</script>

<template>
    <VueFlow
        v-model="projectStore.elements"
        auto-connect
        :default-zoom=".75"
        :max-zoom="1.5"
        :min-zoom=".4"
        :node-types="nodeTypes"
        :connection-mode="ConnectionMode.Strict"
        :connection-radius="50"
        :edge-updater-radius="30"
        :snap-to-grid="true"
        :snap-grid="[20, 20]"
        @edges-change="changeEdge"
        @edge-update="update"
        @connect="connectEdge"
        @drop="onDrop"
        @dragover.prevent
        @dragenter.prevent
        @edge-click="onEdgeclick"
        @pane-click="editorStore.closeFormPanel()"
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