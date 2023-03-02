<script setup lang="ts">
import ContentButton from '@/src/components/ContentButton.vue';
import { useEditorStore } from '@/src/shared/stores';
import { Handle, useVueFlow } from '@vue-flow/core';
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
            :subtitle="node.data.title"
            @click="openForm()"
        />
    </div>
    <Handle
        type="source"
        :position="Position.Right"
        :connectable="!node.data.isSource"
        :class="{ 'not-connected': !node.data.isSource }"
    />
</template>

<style scoped lang="scss">
.vue-flow__handle {
    width: 12px;
    height: 12px;
    top: calc(30px + 1rem + 1px);
    &-right {
        right: -6px;
    }
}

.not-connected {
    background-color: var(--editor-red);
}

</style>