<script setup lang="ts">
//@ts-nocheck
import ContentButton from '../../../components/ContentButton.vue';
import { NodeElement } from '../../../shared/interfaces';
import { useEditorStore } from '../../../shared/stores';
import { Handle } from '@vue-flow/core';

const editorStore = useEditorStore();

const props = defineProps<{
    id: string;
    data: {
        type: object;
        required: true;
    }
}>();

const element: NodeElement = { id: props.id, action: { icon: 'icon-chapitre', type: 'chapter'}, form: editorStore.getForm('chapter') };

function openForm(element: NodeElement) {
    editorStore.openFormPanel(element);
}

</script>

<template>
    <div>
        <ContentButton 
            :icon="element.action.icon"
            :is-active="editorStore.formPanel.openedElement ? editorStore.formPanel.openedElement.id === element.id : false"
            :is-draggable="false"
            :class-list="{ 'btn-content-blue' : false, 'clickable': true, 'btn-content-node': true, 'btn-content-large': true }"
            :subtitle="data.title"
            @click="openForm(element)"
        />
    </div>
    <Handle type="source" position="right" />
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