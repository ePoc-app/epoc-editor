<script setup lang="ts">
import { Handle, useVueFlow } from '@vue-flow/core';
import ContentButton from '../../../components/ContentButton.vue';
import { onMounted } from 'vue';
import { useEditorStore } from '../../../shared/stores';
import { NodeElement } from '../../..//shared/interfaces';
import { Position } from '@vue-flow/core';

const editorStore = useEditorStore();

const props = defineProps<{
    id: string;
    data: {
        type: object;
        required: true;
        readyToDrop: boolean;
        animated: boolean;
        title: string;
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

const { nodes } = useVueFlow();

function openForm(element: NodeElement) {
    editorStore.openFormPanel(element);
}

</script>

<template>
    <p contenteditable="true" class="node-title">{{ data.title }}</p>
    <Handle type="target" :position="Position.Left" />
    <div
        :id="'node'+props.id"
        @dragover="dragOver"
        @dragleave="dragLeave"
        @dragenter="dragEnter"
    >
        <ContentButton
            v-for="element of props.data.elements"
            :key="element.action.icon"
            :icon="element.action.icon"
            :is-active="editorStore.formPanel.openedElement ? editorStore.formPanel.openedElement.id === element.id : false"
            :is-draggable="false"
            :class-list="{ 'btn-content-blue' : false, 'clickable': true, 'btn-content-node': true }"
            @click="openForm(element)"
        />
    </div>
    <Handle type="source" :position="Position.Right" />
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
.node-title {
    margin: .2rem;
    padding: .2rem;
    &:focus-visible {
        outline: 1px solid var(--editor-blue);
        border-radius: 4px;
    }
}
</style>