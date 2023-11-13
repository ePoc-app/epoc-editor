<script setup lang="ts">
import { Handle, Position, getConnectedEdges, useVueFlow, NodeProps, Emits } from '@vue-flow/core';
import { computed, Ref, ref } from 'vue';
import { useEditorStore } from '@/src/shared/stores';
import { NodeElement } from '@/src/shared/interfaces';
import { unselectAllNodes } from '@/src/shared/services/graph';
import { closeFormPanel, exitSelectNodeMode, getConnectedBadges, graphService } from '@/src/shared/services';
import { questions } from '@/src/shared/data';

import DraggableNode from './content/DraggableNode.vue';

const editorStore = useEditorStore();

const props = defineProps<Partial<NodeProps>>();
defineEmits<Partial<Emits>>();

const { findNode, edges, nodes } = useVueFlow({ id: 'main' });

const currentNode = computed(() => findNode(props.id));

const isSource = computed(() => getConnectedEdges([currentNode.value], edges.value).some((edge) => edge.source === props.id));
const isTarget = computed(() => getConnectedEdges([currentNode.value], edges.value).some((edge) => edge.target === props.id));

const isCondition = ref(currentNode.value.data.type === 'condition');
const page: Ref<HTMLElement> = ref(null);

function openPageForm(id: string, formType: string) {
    if(editorStore.selectNodeMode) {
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
        y: event.clientY
    };
    
    const alreadyHasQuestion = currentNode.value.data.elements.some((element: NodeElement) => questions.some((question) => question.type === element.action.type));
    const context = alreadyHasQuestion ? 'pageWithQuestion' : 'page';
    unselectAllNodes();

    graphService.openContextMenu(context, { position, id: currentNode.value.id } );
    currentNode.value.selected = true;
}

const connectable = computed(() => {
    return !isSource.value || isCondition.value;
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
            <p class="node-title" :class="{ 'active': editorStore.openedElementId ? editorStore.openedElementId === props.id : false }">{{ currentNode.data.formValues?.title || 'Page' }}</p>
            <Handle
                :data-testid="`target-page-${pageIndex}`"
                :class="{ 'not-connected': !isTarget }"
                type="target"
                :position="Position.Left"
                :connectable="false"
            />
            <div v-if="connectedBadges.length > 0" class="badge-notification badge-notification-left">
                <img src="/img/badge/notification.svg" alt="notification">
                <small>{{ connectedBadges.length }}</small>
            </div>
            <DraggableNode
                :id="currentNode.data.contentId"
                :parent-test-id="`page-${pageIndex}`"
                :node-id="id"
                :contents="data.elements"
                type="page"
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

<style scoped lang="scss">

.node.hover:has(.ghost) {
    &.node-list {
        padding: 1.5rem;
    }
}

.container.hover {
    .node {
        transition: all .2s ease-in-out;
        box-shadow: 0 2px 5px 0 var(--shadow-outer);

        &:not(.active) {
            background-color: var(--node-hover);
        }
        &.active {
            // #E1F4FA == node-active
            background-color: darken(#E1F4FA, 5%);
        }
    }
}

.vue-flow__handle {
    width: 12px;
    height: 12px;
    top: calc(30px + 1rem + 1px);
    z-index: 20;
    &-left {
        left: -6px;
    }
    &-right {
        right: -6px;
    }
}

.not-connected {
    background-color: var(--editor-red);
}

.container {
    position: relative;
}
.node-title {
    height: 1.5rem;
    margin: 0;
    padding: .2rem;
    top: -1.75rem;
    max-width: calc(60px + 1.8rem);
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: absolute;

    &.active {
        color: var(--editor-blue);
    }
}

</style>