<script setup lang="ts">
import { computed, ref } from 'vue';
import { useEditorStore } from '@/src/shared/stores';
import { moveGuard } from '@/src/shared/utils/draggable';
import { NodeElement, DraggableChange } from '@/src/shared/interfaces';
import { saveState } from '@/src/shared/services/undoRedo.service';
import { addContentToPage, changeContentOrder, removeContentFromPage, openFormPanel } from '@/src/shared/services/graph';
import { useVueFlow } from '@vue-flow/core';
import { getConnectedBadges, graphService } from '@/src/shared/services';

import ContentButton from '@/src/components/ContentButton.vue';

const { findNode } = useVueFlow({ id: 'main' });
const editorStore = useEditorStore();

const props = defineProps<{
    nodeId: string;
    contents: NodeElement[];
    type: 'page' | 'activity';
    parentTestId: string;
}>();

const emit = defineEmits<{
    (e: 'removeHoverEffect'),
    (e: 'addHoverEffect'),
}>();

const dragOptions = computed(() => {
    return {
        group: {
            name: 'node',
            put: !isCondition,
        },
        disabled: editorStore.selectNodeMode,
        sort: !isCondition,
        ghostClass: 'ghost',
        animation: 200,
        move: moveGuard,
    };
});

const draggableClass = computed(() => {
    return {
        'page-node': props.type === 'page',
        'activity-node': props.type === 'activity',
        'active': editorStore.openedElementId ? editorStore.openedElementId === props.nodeId : false,
    };
});

const dropped = ref(false);

const currentNode = computed(() => findNode(props.nodeId));

const isCondition = currentNode.value.data.type === 'condition';
const classList = {
    'clickable': true,
    'btn-content-node': true
};

function change(event: DraggableChange) {
    if(!editorStore.draggedElement) return;

    const { added, moved, removed } = event;

    if(added && dropped.value) {
        saveState();
        dropped.value = false;
        addContentToPage(props.nodeId, added.element, added.newIndex);
    }

    if(moved) {
        saveState();
        const { oldIndex, newIndex } = moved;
        changeContentOrder(oldIndex, newIndex, props.nodeId);
    }

    if(removed) {
        const { oldIndex } = removed;
        removeContentFromPage(oldIndex, props.nodeId, true);
    }
}

function drop() {
    dropped.value = true;
    document.body.classList.remove('cursor-not-allowed', 'cursor-allowed');
}

function dragStart(event: DragEvent, element: NodeElement, index: number) {
    editorStore.draggedElement = {
        type: 'nodeElement',
        element,
        source: {
            parentId: props.nodeId,
            index,
        }
    };
    editorStore.draggedElement.type = 'nodeElement';
    editorStore.draggedElement.element = element;
}

function closeFormPanel() {
    editorStore.closeFormPanel();
}

function onContextMenu(contentId: string) {
    graphService.openContextMenu('content', { pageId: currentNode.value.id, id: contentId });
}

</script>

<template>
    <VueDraggable
        v-bind="dragOptions"
        :id="'node' + nodeId"
        :model-value="contents"
        class="node-list node hover"
        :class="draggableClass"
        @change="change"
        @drop.stop="drop"
    >
        <!--suppress VueUnrecognizedSlot -->
        <template #item="{ element, index }">
            <div class="node-item" :class="{ 'condition': isCondition }">
                <div
                    v-if="getConnectedBadges(element.contentId).length > 0"
                    class="badge-notification badge-notification-right"
                >
                    <img src="/img/badge/notification.svg" alt="notification">
                    <!--suppress JSUnresolvedReference -->
                    <small>{{ getConnectedBadges(element.contentId).length }}</small>
                </div>
                <ContentButton
                    :data-testid="`${parentTestId}-${index}`"
                    :icon="element.action.icon"
                    :is-draggable="!isCondition && !editorStore.selectNodeMode"
                    :is-active="editorStore.openedElementId ? editorStore.openedElementId === element.id : false"
                    :class-list="classList"
                    @click.exact="openFormPanel(element)"
                    @click.meta="closeFormPanel"
                    @click.ctrl="closeFormPanel"
                    @mousedown.stop
                    @mouseenter="emit('removeHoverEffect')"
                    @mouseleave="emit('addHoverEffect')"
                    @dragstart="dragStart($event, element, index)"
                    @contextmenu="onContextMenu(element.id)"
                />
            </div>
        </template>
    </VueDraggable>
</template>

<style scoped lang="scss">

.node-item {
    transition: text .2s linear;
    position: relative;
}

</style>