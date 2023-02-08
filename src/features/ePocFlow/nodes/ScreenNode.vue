<script setup lang="ts">
import { Handle, getConnectedEdges, useVueFlow } from '@vue-flow/core';
import ContentButton from '@/src/components/ContentButton.vue';
import { onMounted, ref } from 'vue';
import { useEditorStore } from '@/src/shared/stores';
import { NodeElement } from '@/src/shared/interfaces';
import { Position } from '@vue-flow/core';
import { connected } from 'process';

const editorStore = useEditorStore();

const props = defineProps<{
    id: string;
    data: {
        type: object;
        required: true;
        readyToDrop: boolean;
        animated: boolean;
        elements: NodeElement[];
    }
}>();

// This add an animation when the node is added to the flow
onMounted(() => {
    const node = document.querySelector('#node' + props.id);
    node.classList.add('node');
    if(props.data.animated) node.classList.add('node-creation-animation');
});

//TODO: Think about refactoring this
let dragOverCount = 0;

function dragOver(event) {
    if(event.dataTransfer.types.length > 1) return;
    dragOverCount ++;
    if(dragOverCount > 25) {
        dragOverCount = 0;
        nodes.value.find(element => element.id === props.id).data.readyToDrop = true;
        document.querySelector('#node'+props.id).classList.add('node-animate');

        // To be sure the counter is set to 1 when ready to drop
        counter = 1;
    }
}

// This counter is used to avoid triggering dragLeave when not necessary
let counter = 0;

function dragLeave() {
    counter --;
    if (counter > 0) return;
    nodes.value.find(element => element.id === props.id).data.readyToDrop = false;
    document.querySelector('#node'+props.id).classList.remove('node-animate');
    dragOverCount = 0;
}

function dragEnter(event) {
    event.preventDefault();
    counter ++;
}

const { nodes, edges, findNode, onConnect } = useVueFlow({ id: 'main' });

function openForm(element: NodeElement) {
    editorStore.openFormPanel(element.id, element.form, element.parentId);
}


// const node = ref(findNode(props.id));
// const connectedEdges = ref(getConnectedEdges([node.value], edges.value));

// const source = ref(connectedEdges.value.forEach((edge) => { if(edge.source === props.id) return true; }));
// const target = ref(connectedEdges.value.forEach((edge) => { if(edge.target === props.id) return true; }));

// onConnectEnd(() => {
//     console.log('source', source.value);
//     console.log('target', target.value);
// });

const isSource = ref(false);
const isTarget = ref(false);

onConnect((params) => {
    if(params.source === props.id) isSource.value = true;
    if(params.target === props.id) isTarget.value = true;
});

</script>

<template>
    <p contenteditable="true" class="node-title">Screen</p>
    <Handle :class="{ 'connected': !isTarget }" type="target" :position="Position.Left" />
    <div
        :id="'node'+props.id"
        :class=" { 'active': editorStore.openedNodeId ? editorStore.openedNodeId === props.id : false }"
        class="node"
        @dragover="dragOver"
        @dragleave="dragLeave"
        @dragenter="dragEnter"
    >
        <ContentButton
            v-for="element of props.data.elements"
            :key="element.action.icon"
            :icon="element.action.icon"
            :is-active="editorStore.openedNodeId ? editorStore.openedNodeId === element.id : false"
            :is-draggable="false"
            :class-list="{ 'btn-content-blue' : false, 'clickable': true, 'btn-content-node': true }"
            @click="openForm(element)"
        />
    </div>
    <Handle :class="{ 'connected': !isSource }" type="source" :position="Position.Right" />
</template>

<style scoped lang="scss">

.vue-flow__handle {
    width: 12px;
    height: 12px;
    &-left {
        left: -6px;
    }
    &-right {
        right: -6px;
    }
}

.connected {
    background-color: var(--editor-red);
}
.node-title {
    margin: .2rem;
    padding: .2rem;
    &:focus-visible {
        outline: 1px solid var(--editor-blue);
        border-radius: 4px;
    }
}
</style>