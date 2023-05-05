<script setup lang="ts">
import { ConnectionMode, useVueFlow, VueFlow, getConnectedEdges, applyEdgeChanges } from '@vue-flow/core';
import { markRaw, onMounted } from 'vue';
import ScreenNode from './nodes/ScreenNode.vue';
import CustomConnectContent from './edges/CustomConnectContent.vue';
import { useEditorStore, useProjectStore } from '@/src/shared/stores';
import ChapterNode from './nodes/ChapterNode.vue';
import ePocNode from './nodes/ePocNode.vue';
import AddChapterNode from './nodes/AddChapterNode.vue';
import { NodeElement, SideAction } from '@/src/shared/interfaces';

const { vueFlowRef, project, updateEdge, findNode, edges }  = useVueFlow({ id: 'main' });


const editorStore = useEditorStore();
const projectStore = useProjectStore();

const nodeTypes = {
    content: markRaw(ScreenNode),
    chapter: markRaw(ChapterNode),
    epoc: markRaw(ePocNode),
    add: markRaw(AddChapterNode), 
};

const onDrop = (event) => {
    document.body.classList.remove('cursor-allowed', 'cursor-not-allowed');

    if(!editorStore.draggedElement) return;

    const { left, top } = vueFlowRef.value.getBoundingClientRect();

    const position = project({
        x: event.clientX - left,
        y: event.clientY - top,
    });

    const { element, type, source } = editorStore.draggedElement;

    if(type === 'sideAction') projectStore.addNode(position, element as SideAction[]);
    else if(type === 'nodeElement') {
        projectStore.createNodeFromElement(position, element as NodeElement);

        setTimeout(() => {
            editorStore.removeElementFromScreen(source.index, source.parentId, true);
        }, 0);
    }

};

onMounted(() => {
    projectStore.restore();
});


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

function selectionStart() {
    editorStore.closeFormPanel();
}

function update(event) {
    updateEdge(event.edge, {
        source: event.connection.source,
        target: event.connection.target,
    });
}

function nodeChange(event) {
    if(event[0].type === 'remove') {
        editorStore.closeFormPanel();
    }
}

function onDragOver() {
    document.body.classList.add('cursor-allowed');
}

function connect(event) {
    const targetNode = findNode(event.target);
    const sourceNode = findNode(event.source);

    if(event.source === event.target) {
        const currentEdge = edges.value.find((edge) => edge.target === targetNode.id && edge.source === sourceNode.id);
        applyEdgeChanges(
            [{ id: currentEdge.id, type: 'remove' }],
            edges.value
        );
        return false;
    }

    const otherEdge = getConnectedEdges([targetNode], edges.value).find((edge) => edge.target === targetNode.id && edge.source !== sourceNode.id);


    if(otherEdge) {
        applyEdgeChanges(
            [{ id: otherEdge.id, type: 'remove' }],
            edges.value
        );
    }
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
        :snap-grid="[16, 16]"
        @edge-update="update"
        @nodes-change="nodeChange"
        @selection-start="selectionStart"
        @drop="onDrop"
        @dragover.prevent="onDragOver"
        @dragenter.prevent
        @edgeclick="onEdgeclick"
        @pane-click="editorStore.closeFormPanel()"
        @connect="connect"
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