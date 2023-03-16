<script setup lang="ts">
import ContentButton from '@/src/components/ContentButton.vue';
import { useEditorStore } from '@/src/shared/stores';
import { Handle, useVueFlow } from '@vue-flow/core';
import { Position } from '@vue-flow/core';
import { computed } from 'vue';

const editorStore = useEditorStore();

const props = defineProps<{
    id: string;
    data: {
        type: object;
        required: true;
        title: string;
    }
}>();

const { findNode, nodes } = useVueFlow({ id: 'main' });    

const node = findNode(props.id);

function openForm() {
    editorStore.openFormPanel(node.id, node.data.formType, node.data.formValues);
}

const subtitle = computed(() => {
    const chapters = nodes.value.filter(node => node.type === 'chapter');
    const epocNode = findNode('1');
    const label = epocNode.data.formValues.chapterParameter ? epocNode.data.formValues.chapterParameter : 'Chapter';
    return `${label} ${chapters.findIndex(chapter => chapter.id === node.id) + 1}` ;
});

</script>

<template>
    <div>
        <ContentButton 
            :icon="node.data.action.icon"
            :is-active="editorStore.openedNodeId ? editorStore.openedNodeId === node.id : false"
            :is-draggable="false"
            :class-list="{ 'btn-content-blue' : false, 'clickable': true, 'btn-content-node': true, 'btn-content-large': true }"
            :subtitle="subtitle"
            @click="openForm()"
            @mousedown="editorStore.closeFormPanel()"
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