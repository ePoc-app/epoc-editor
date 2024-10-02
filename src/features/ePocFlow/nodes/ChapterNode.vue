<script setup lang="ts">
import { useEditorStore } from '@/src/shared/stores';
import { Handle, useVueFlow, getConnectedEdges, NodeProps } from '@vue-flow/core';
import { Position } from '@vue-flow/core';
import { computed } from 'vue';
import ContentButton from '@/src/components/ContentButton.vue';
import { closeFormPanel, exitSelectNodeMode, getConnectedBadges, graphService } from '@/src/shared/services';

const editorStore = useEditorStore();

const props = defineProps<Partial<NodeProps>>();

const { findNode, nodes, edges } = useVueFlow('main');

const currentNode = findNode(props.id);

const subtitle = computed(() => {
    const epocNode = findNode('1');
    const chapterParameter = epocNode?.data?.formValues?.chapterParameter || 'Chapitre';
    const label = chapterParameter.length > 8 ? chapterParameter.substring(0, 7) + '...' : chapterParameter;

    return `${label} ${currentNode.data.index}`;
});

const isSource = computed(() =>
    getConnectedEdges([currentNode], edges.value).some((edge) => edge.source === props.id),
);

const classList = {
    clickable: true,
    'btn-content-node': true,
    'btn-content-large': true,
};

function openForm() {
    if (editorStore.selectNodeMode) {
        exitSelectNodeMode(currentNode.id);
    } else {
        editorStore.openFormPanel(currentNode.id, currentNode.data.formType);
    }
}

function mouseDown() {
    closeFormPanel();

    // unselect all nodes except current node
    nodes.value.forEach((node) => (node.selected = currentNode.id === node.id));

    const chapters = nodes.value.filter((node) => node.type === 'chapter');
    chapters.forEach((chapter) => {
        if (chapter.id !== currentNode.id) chapter.selected = false;
    });
}

function onContextMenu() {
    graphService.openContextMenu('chapter', { id: currentNode.id });
}

const connectedBadges = computed(() => getConnectedBadges(currentNode.data.contentId));
</script>

<template>
    <div>
        <div class="node-chapter">
            <div v-if="connectedBadges.length > 0" class="badge-notification badge-notification-left">
                <img src="/img/badge/notification.svg" alt="notification" />
                <small>{{ connectedBadges.length }}</small>
            </div>

            <p
                class="node-title"
                :class="{ active: editorStore.openedElementId ? editorStore.openedElementId === props.id : false }"
            >
                {{ currentNode.data.formValues.title }}
            </p>
            <ContentButton
                :id="currentNode.data.contentId"
                :data-testid="`chapter-${currentNode.data.index}`"
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
            :data-testid="`source-chapter-${currentNode.data.index}`"
            type="source"
            :position="Position.Right"
            :connectable="!isSource && !editorStore.selectNodeMode"
            :class="{ 'not-connected': !isSource }"
            @mousedown.stop
        />
    </div>
</template>
