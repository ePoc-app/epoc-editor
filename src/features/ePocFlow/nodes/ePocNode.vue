<script setup lang="ts">
import { useEditorStore } from '@/src/shared/stores';
import { useVueFlow } from '@vue-flow/core';
import ContentButton from '@/src/components/ContentButton.vue';
import { exitSelectNodeMode, graphService } from '@/src/shared/services';
import { computed } from 'vue';

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

const selected = computed(() => editorStore.openedElementId ? editorStore.openedElementId === currentNode.id : false);
const isActive = computed(() => selected.value && !editorStore.selectNodeMode);

function openForm() {
    if(editorStore.selectNodeMode) {
        exitSelectNodeMode(currentNode.id);
    } else {
        editorStore.openFormPanel(currentNode.id, currentNode.data.formType);
    }
}

function onContextMenu() {
    graphService.openContextMenu('epoc', {});    
}

</script>

<template>
    <div>
        <ContentButton 
            :icon="currentNode.data.action.icon"
            :is-draggable="false"
            :class-list="classList"
            :is-active="isActive"
            subtitle="ePoc"
            @click="openForm()"
            @mousedown="editorStore.closeFormPanel()"
            @contextmenu="onContextMenu"
        />
    </div>
</template>