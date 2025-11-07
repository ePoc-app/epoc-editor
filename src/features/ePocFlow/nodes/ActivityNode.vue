<script setup lang="ts">
import { Handle, Position, getConnectedEdges, useVueFlow, NodeProps } from '@vue-flow/core';
import { computed, ref } from 'vue';
import { useEditorStore } from '@/src/shared/stores';
import { getSelectedNodes } from '@/src/shared/services/graph';
import { closeFormPanel, exitSelectNodeMode, getConnectedBadges, graphService } from '@/src/shared/services';
import DraggableNode from '@/src/features/ePocFlow/nodes/content/DraggableNode.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const editorStore = useEditorStore();

const props = defineProps<Partial<NodeProps>>();

const { findNode, edges, nodes } = useVueFlow('main');

const currentNode = computed(() => findNode(props.id));

const isSource = computed(() =>
    getConnectedEdges([currentNode.value], edges.value).some((edge) => edge.source === props.id),
);
const isTarget = computed(() =>
    getConnectedEdges([currentNode.value], edges.value).some((edge) => edge.target === props.id),
);

const isCondition = ref(currentNode.value.data.type === 'condition');
const page = ref(null);

function openPageForm(id: string, formType: string) {
    if (editorStore.selectNodeMode) {
        exitSelectNodeMode(id);
    } else {
        editorStore.openFormPanel(id, formType);
    }
}

function addHoverEffect() {
    page.value.classList.add('hover');
}

function removeHoverEffect() {
    page.value.classList.remove('hover');
}

function onContextMenu(event: MouseEvent) {
    const position = {
        x: event.clientX,
        y: event.clientY,
    };

    const selection = JSON.stringify(getSelectedNodes());

    graphService.openContextMenu('activity', { position, id: currentNode.value.id, selection });
    currentNode.value.selected = true;
}

const connectable = computed(() => {
    return !isSource.value || isCondition.value;
});

const connectedBadges = computed(() => getConnectedBadges(currentNode.value.data.contentId));

const activityIndex = computed(() => {
    const activities = nodes.value.filter((node) => node.type === 'activity');
    return activities.findIndex((activity) => activity.id === currentNode.value.id) + 1;
});
</script>

<template>
    <div>
        <div
            ref="page"
            :data-testid="`activity-${activityIndex}`"
            class="container"
            @click.exact="openPageForm(currentNode.id, currentNode.data.formType)"
            @click.meta="closeFormPanel"
            @click.ctrl="closeFormPanel"
            @mouseenter="addHoverEffect"
            @mouseleave="removeHoverEffect"
            @mousedown="closeFormPanel"
            @contextmenu.stop="onContextMenu"
            @dragover.stop
        >
            <!--suppress JSUnresolvedReference -->
            <p
                class="node-title"
                :class="{ active: editorStore.openedElementId ? editorStore.openedElementId === props.id : false }"
            >
                {{ currentNode.data.formValues?.title || t('forms.node.activity') }}
            </p>

            <Handle
                :data-testid="`target-activity-${activityIndex}`"
                :class="{ 'not-connected': !isTarget }"
                type="target"
                :position="Position.Left"
            />

            <div v-if="connectedBadges.length > 0" class="badge-notification">
                <img src="/img/badge/notification.svg" alt="notification" />
                <small>{{ connectedBadges.length }}</small>
            </div>

            <div v-if="currentNode.data.formValues?.rule?.and?.length" class="locked">
                <i class="icon-lock" />
            </div>

            <DraggableNode
                :id="currentNode.data.contentId"
                :parent-test-id="`activity-${activityIndex}`"
                :node-id="id"
                :contents="data.elements"
                type="activity"
                @add-hover-effect="addHoverEffect"
                @remove-hover-effect="removeHoverEffect"
            />
        </div>

        <Handle
            :data-testid="`source-activity-${activityIndex}`"
            type="source"
            :class="{ 'not-connected': connectable }"
            :position="Position.Right"
            :connectable="connectable && !editorStore.selectNodeMode"
        />
    </div>
</template>

<style scoped lang="scss">
.node {
    border: 2px dashed var(--dashed-border);

    &.highlight {
        border: 2px dashed var(--editor-yellow) !important;
    }
}

.vue-flow__node.selected .node {
    border: 2px dashed var(--editor-blue);
}
</style>
