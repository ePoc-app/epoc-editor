<script setup lang="ts">
import { useEditorStore } from '@/src/shared/stores';
import { Handle, useVueFlow, getConnectedEdges, NodeProps } from '@vue-flow/core';
import { Position } from '@vue-flow/core';
import { computed } from 'vue';
import ContentButton from '@/src/components/ContentButton.vue';
import { closeFormPanel, exitSelectNodeMode, getConnectedBadges, graphService } from '@/src/shared/services';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const editorStore = useEditorStore();

const props = defineProps<Partial<NodeProps>>();

const { findNode, nodes, edges } = useVueFlow('main');

const currentNode = findNode(props.id);

const isSource = computed(() => getConnectedEdges([currentNode], edges.value).some((edge) => edge.source === props.id));

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
            <div v-if="connectedBadges.length > 0" class="badge-notification">
                <img src="/img/badge/notification.svg" alt="notification" />
                <small>{{ connectedBadges.length }}</small>
            </div>

            <div v-if="currentNode.data.formValues.rule" class="locked">
                <i class="icon-lock" />
            </div>
            
            <ContentButton
                :id="currentNode.data.contentId"
                :data-testid="`chapter-${currentNode.data.index}`"
                :icon="currentNode.data.action.icon"
                :is-draggable="false"
                :class-list="classList"
                :is-active="editorStore.openedElementId ? editorStore.openedElementId === currentNode.id : false"
                :subtitle="currentNode.data.formValues.title || t('global.chapter')"
                class="chapter-node"
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

<style lang="scss">
.chapter-node > .text {
    overflow: hidden;
    padding: 0.25rem;
    width: 100%;
    box-sizing: border-box;

    & > span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        text-align: center;
    }
}
</style>
