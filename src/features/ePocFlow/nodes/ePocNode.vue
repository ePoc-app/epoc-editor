<script setup lang="ts">
import ContentButton from '@/src/components/ContentButton.vue';
import { useEditorStore } from '@/src/shared/stores';
import { useVueFlow } from '@vue-flow/core';

const editorStore = useEditorStore();
const props = defineProps<{
    id: string;
    data: {
        type: object;
        required: true;
    }
}>();

const { findNode } = useVueFlow({ id: 'main' });

const node = findNode(props.id);

function openForm() {
    editorStore.openFormPanel(node.id, node.data.formType, node.data.formValues);
}

</script>

<template>
    <div>
        <ContentButton 
            :icon="node.data.action.icon"
            :is-active="editorStore.openedNodeId ? editorStore.openedNodeId === node.id : false"
            :is-draggable="false"
            :class-list="{ 'btn-content-blue' : false, 'clickable': true, 'btn-content-node': true, 'btn-content-large': true }"
            subtitle="ePoc"
            @click="openForm()"
            @mousedown="editorStore.closeFormPanel()"
        />
    </div>
</template>