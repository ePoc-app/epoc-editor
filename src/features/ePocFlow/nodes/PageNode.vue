<script setup lang="ts">
import { Handle, Position, getConnectedEdges, useVueFlow, NodeProps } from '@vue-flow/core';
import { computed, Ref, ref } from 'vue';
import { useEditorStore } from '@/src/shared/stores';
import { NodeElement } from '@/src/shared/interfaces';
import { unselectAllNodes } from '@/src/shared/services/graph';
import { closeFormPanel, exitSelectNodeMode, getConnectedBadges, graphService } from '@/src/shared/services';
import { questions } from '@/src/shared/data';

import DraggableNode from './content/DraggableNode.vue';

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
const page: Ref<HTMLElement> = ref(null);

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

    const alreadyHasQuestion = currentNode.value.data.elements.some((element: NodeElement) =>
        questions.value.some((question) => question.type === element.action.type),
    );
    const context = alreadyHasQuestion ? 'pageWithQuestion' : 'page';
    unselectAllNodes();

    graphService.openContextMenu(context, { position, id: currentNode.value.id });
    currentNode.value.selected = true;
}

const connectable = computed(() => {
    if (isCondition.value) {
        return (
            getConnectedEdges([currentNode.value], edges.value).filter((edge) => edge.source === props.id).length < 2
        );
    }
    return !isSource.value;
});

const connectedBadges = computed(() => getConnectedBadges(currentNode.value.data.contentId));

const pageIndex = computed(() => {
    const pages = nodes.value.filter((node) => node.type === 'page');
    return pages.findIndex((page) => page.id === currentNode.value.id) + 1;
});
</script>

<template>
    <div>
        <div
            ref="page"
            :data-testid="`page-${pageIndex}`"
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
                {{ currentNode.data.formValues?.title || 'Page' }}
            </p>

            <Handle
                :data-testid="`target-page-${pageIndex}`"
                :class="{ 'not-connected': !isTarget }"
                type="target"
                :position="Position.Left"
            />

            <div v-if="connectedBadges.length > 0" class="badge-notification">
                <img src="/img/badge/notification.svg" alt="notification" />
                <small>{{ connectedBadges.length }}</small>
            </div>

            <div v-if="currentNode.data.formValues.rule" class="locked">
                <i class="icon-lock" />
            </div>

            <DraggableNode
                :id="currentNode.data.contentId"
                :parent-test-id="`page-${pageIndex}`"
                :node-id="id"
                :contents="data.elements"
                type="page"
                :disable-drag="true"
                @add-hover-effect="addHoverEffect"
                @remove-hover-effect="removeHoverEffect"
            />
        </div>
        <Handle
            :data-testid="`source-page-${pageIndex}`"
            type="source"
            :class="{ 'not-connected': connectable }"
            :position="Position.Right"
            :connectable="connectable && !editorStore.selectNodeMode"
        />
    </div>
</template>
