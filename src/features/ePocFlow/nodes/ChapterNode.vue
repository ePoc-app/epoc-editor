<script setup lang="ts">
import ContentButton from '@/src/components/ContentButton.vue';
import { NodeElement } from '@/src/shared/interfaces';
import { useEditorStore } from '@/src/shared/stores';
import { Handle } from '@vue-flow/core';
import { Position } from '@vue-flow/core';

const editorStore = useEditorStore();

const props = defineProps<{
    id: string;
    data: {
        type: object;
        required: true;
        title: string;
    }
}>();

const element: NodeElement = { id: props.id, action: { icon: 'icon-chapitre', type: 'chapter'}, form: editorStore.getForm('chapter') };

function openForm(element: NodeElement) {
    editorStore.openFormPanel(element.id, element.form);
}

</script>

<template>
    <div>
        <ContentButton 
            :icon="element.action.icon"
            :is-active="editorStore.openedNodeId ? editorStore.openedNodeId === element.id : false"
            :is-draggable="false"
            :class-list="{ 'btn-content-blue' : false, 'clickable': true, 'btn-content-node': true, 'btn-content-large': true }"
            :subtitle="data.title"
            @click="openForm(element)"
        />
    </div>
    <Handle type="source" :position="Position.Right" />
</template>

<style scoped lang="scss">
.vue-flow__handle {
    width: 12px;
    height: 12px;
    &-right {
        right: -6px;
    }
}
</style>