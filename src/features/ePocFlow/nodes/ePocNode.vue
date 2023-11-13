<script setup lang="ts">
import { useEditorStore } from '@/src/shared/stores';
import { FlowEmits, NodeProps, useVueFlow } from '@vue-flow/core';
import ContentButton from '@/src/components/ContentButton.vue';
import { closeFormPanel, exitSelectNodeMode, graphService } from '@/src/shared/services';
import { computed } from 'vue';

const editorStore = useEditorStore();

const props = defineProps<Partial<NodeProps>>();
defineEmits<Partial<FlowEmits>>();

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
    <div class="rotated">
        <ContentButton
            data-testid="epoc-node"
            :icon="currentNode.data.action.icon"
            :is-draggable="false"
            :class-list="classList"
            :is-active="isActive"
            subtitle="ePoc"
            :rotate="true"
            @click="openForm()"
            @mousedown="closeFormPanel()"
            @contextmenu="onContextMenu"
        />
    </div>
</template>

<style scoped lang="scss">
.rotated {
    transform: rotate(45deg);

    i, span {
        transform: rotate(-45deg);
        color: red;
    }
}
</style>