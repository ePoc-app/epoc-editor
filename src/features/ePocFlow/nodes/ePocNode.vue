<script setup lang="ts">
import { useEditorStore } from '@/src/shared/stores';
import { useVueFlow } from '@vue-flow/core';
import ContentButton from '@/src/components/ContentButton.vue';

const editorStore = useEditorStore();
const props = defineProps<{
    id: string;
    data: {
        type: object;
        required: true;
    }
}>();

const { findNode } = useVueFlow({ id: 'main' });

const currentNode = findNode(props.id);

const classList = {
    'clickable': true,
    'btn-content-node': true,
    'btn-content-large': true,
};


function openForm() {
    editorStore.openFormPanel(currentNode.id, currentNode.data.formType, currentNode.data.formValues);
}

</script>

<template>
    <div>
        <ContentButton 
            :icon="currentNode.data.action.icon"
            :is-draggable="false"
            :class-list="classList"
            :is-active="editorStore.openedElementId ? editorStore.openedElementId === currentNode.id : false"
            subtitle="ePoc"
            @click="openForm()"
            @mousedown="editorStore.closeFormPanel()"
        />
    </div>
</template>