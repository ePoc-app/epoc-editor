<script setup lang="ts">
import { useEditorStore } from '@/src/shared/stores';
import { Handle, useVueFlow, getConnectedEdges } from '@vue-flow/core';
import { Position } from '@vue-flow/core';
import { computed } from 'vue';
import ContentButton from '@/src/components/ContentButton.vue';
import { exitSelectNodeMode, getConnectedBadges, graphService } from '@/src/shared/services';

const editorStore = useEditorStore();

const props = defineProps<{
    id: string;
    data: {
        type: object;
        required: true;
        title: string;
    }
}>();

const { findNode, nodes, edges } = useVueFlow({ id: 'main' });    

const currentNode = findNode(props.id);

const subtitle = computed(() => {
    const chapters = nodes.value.filter(node => node.type === 'chapter');
    const epocNode = findNode('1');
    const chapterParameter = epocNode?.data?.formValues?.chapterParameter || 'Chapitre';
    const label = chapterParameter.length > 8 ? chapterParameter.substring(0, 7) + '...' : chapterParameter;
    const chapterIndex = chapters.findIndex(chapter => chapter.id === currentNode.id) + 1;

    return `${label} ${chapterIndex}`;
});

const isSource = computed(() => getConnectedEdges([currentNode], edges.value).some((edge) => edge.sourceNode.id === props.id));

const classList = {
    'clickable': true,
    'btn-content-node': true,
    'btn-content-large': true,
};


function openForm() {
    if(editorStore.selectNodeMode) {
        exitSelectNodeMode(currentNode.id);
    } else {
        editorStore.openFormPanel(currentNode.id, currentNode.data.formType);
    }
}

function mouseDown() {
    editorStore.closeFormPanel();
    
    // unselect all nodes except current node
    nodes.value.forEach((node) => node.selected = currentNode.id === node.id);

    const chapters = nodes.value.filter(node => node.type === 'chapter');
    chapters.forEach((chapter) => {
        if(chapter.id !== currentNode.id) chapter.selected = false;
    });
}

function onContextMenu() {
    graphService.openContextMenu('chapter', { id: currentNode.id });
}

const connectedBadges = computed(() => getConnectedBadges(currentNode.data.contentId));

</script>

<template>
    <div class="node-chapter">
        <div v-if="connectedBadges.length > 0" class="badge-notification badge-notification-left">
            <img src="/img/badge/notification.svg" alt="notification">
            <small>{{ connectedBadges.length }}</small>
        </div>
        <ContentButton
            :icon="currentNode.data.action.icon"
            :is-draggable="false"
            :class-list="classList"
            :is-active="editorStore.openedElementId ? editorStore.openedElementId === currentNode.id : false"
            :subtitle="subtitle"
            @click="openForm()"
            @mousedown="mouseDown"
            @contextmenu="onContextMenu"
        />
    </div>
    <!-- ! mousedown.stop important in vue-flow v1.16.4 on non draggable node -->
    <Handle
        type="source"
        :position="Position.Right"
        :connectable="!isSource && !editorStore.selectNodeMode"
        :class="{ 'not-connected': !isSource }"
        @mousedown.stop
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