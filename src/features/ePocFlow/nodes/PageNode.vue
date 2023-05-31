<script setup lang="ts">
import { Handle, Position, getConnectedEdges, useVueFlow } from '@vue-flow/core';
import { computed, ref } from 'vue';
import { useEditorStore } from '@/src/shared/stores';
import { NodeElement } from '@/src/shared/interfaces';
import ContentButton from '@/src/components/ContentButton.vue';
import { addContentToPage, removeContentFromPage, changeContentOrder } from '@/src/shared/services/graph';
import { questions } from '@/src/shared/data';

const editorStore = useEditorStore();

const props = defineProps<{
    id: string;
    data: {
        type: string;
        required: true;
        elements: NodeElement[];
        isSource: boolean;
        isTarget: boolean;
    }
}>();

const { findNode, edges } = useVueFlow({ id: 'main' });

const currentNode = findNode(props.id);
const dropped = ref(false);

const isSource = computed(() => getConnectedEdges([currentNode], edges.value).some((edge) => edge.source === props.id));
const isTarget = computed(() => getConnectedEdges([currentNode], edges.value).some((edge) => edge.target === props.id));

const classList = {
    'clickable': true,
    'btn-content-node': true,
};

const isCondition = ref(currentNode.data.type === 'condition');
const page = ref(null);

const dragOptions = ref({
    group: {
        name: 'node',
        put: !isCondition.value,
    },
    disabled: false,
    sort: !isCondition.value,
    ghostClass: 'ghost',
    animation: 200
});

function openForm(element: NodeElement) {
    editorStore.openFormPanel(element.id, element.formType, element.formValues, element.parentId);
}

function openPageForm(id, formType, formValues) {
    editorStore.openFormPanel(id, formType, formValues);
}

let leaveTimeout = null;

function dragLeave(event) {
    // Reset timeout to prevent flickering
    leaveTimeout = setTimeout(() => {
        event.target.classList.remove('hover');
        dragOptions.value.disabled = false;
        leaveTimeout = null;
    }, 300);
}

function dragOver(event) {
    if(!editorStore.draggedElement) return;
    if(leaveTimeout) {
        // Reset timeout to prevent flickering
        clearTimeout(leaveTimeout);
        leaveTimeout = null;
    }

    event.target.classList.add('hover');

    const { element } = editorStore.draggedElement;

    if(canBeDrop(element)) {
        document.body.classList.remove('cursor-not-allowed');
        document.body.classList.add('cursor-allowed');
    } else {
        document.body.classList.remove('cursor-allowed');
        document.body.classList.add('cursor-not-allowed');
        dragOptions.value.disabled = true;
    }
}

function change(event) {
    if(!editorStore.draggedElement) return;

    const { added, moved, removed } = event;

    if(added && dropped.value) {
        dropped.value = false;
        if (canBeDrop(added.element)) {
            addContentToPage(currentNode.id, added.element, added.newIndex);
        }
        // todo handle when the drop is rejected not deleting the moved content from another page
    }

    if(moved) {
        const { oldIndex, newIndex } = moved;
        changeContentOrder(oldIndex, newIndex, props.id);
    }

    if(removed) {
        const { oldIndex } = removed;
        removeContentFromPage(oldIndex, props.id, true);
    }
}

function canBeDrop (elem) : boolean {
    const type = elem.type ? elem.type : Array.isArray(elem) ? elem[0].type : elem.action.type;
    const currentNode = findNode(props.id);
    const isQuestion = questions.some(q => q.type === type);
    return !isQuestion || (isQuestion && !currentNode.data.elements.some(e => {
        return questions.some(q => q.type === e.action.type);
    }));
}

function drop() {
    dropped.value = true;
    document.body.classList.remove('cursor-not-allowed', 'cursor-allowed');
}

function dragStart(event, element: NodeElement, index: number) {
    editorStore.draggedElement = {
        type: 'nodeElement',
        element: element,
        source: {
            parentId: props.id,
            index: index,
        }
    };
    editorStore.draggedElement.type = 'nodeElement';
    editorStore.draggedElement.element = element;
}

function closeFormPanel() {
    editorStore.closeFormPanel();
}

function addHoverEffect() {
    page.value.classList.add('hover');
}

function removeHoverEffect() {
    page.value.classList.remove('hover');
}

</script>

<template>
    <div>
        <div 
            ref="page"
            class="container"
            @click.exact="openPageForm(currentNode.id, currentNode.data.formType, currentNode.data.formValues)"
            @click.meta="closeFormPanel"
            @click.ctrl="closeFormPanel"
            @mouseenter="addHoverEffect"
            @mouseleave="removeHoverEffect"
            @mousedown="closeFormPanel"
        >
            <p class="node-title" :class="{ 'active': editorStore.openedElementId ? editorStore.openedElementId === props.id : false }">{{ currentNode.data.formValues?.title || 'Page' }}</p>
            <Handle
                :class="{ 'not-connected': !isTarget }"
                type="target"
                :position="Position.Left"
                :connectable="false"
            />
            <VueDraggable
                v-bind="dragOptions"
                :id="'node'+ props.id"
                :model-value="data.elements"
                class="node-list node"
                item-key="id"
                :class=" { 'active': editorStore.openedElementId ? editorStore.openedElementId === props.id : false }"
                @change="change"
                @drop.stop="drop"
                @dragover.stop="dragOver"
                @dragleave="dragLeave"
            >
                <template #item="{ element, index }">
                    <div :key="index" class="node-item" :class="{ 'condition': isCondition }">
                        <ContentButton
                            :key="index"
                            :icon="element.action.icon"
                            :is-draggable="!isCondition"
                            :is-active="editorStore.openedElementId ? editorStore.openedElementId === element.id : false"
                            :class-list="classList"
                            @click.exact="openForm(element)"
                            @click.meta="closeFormPanel"
                            @click.ctrl="closeFormPanel"
                            @mousedown.stop
                            @mouseenter="removeHoverEffect"
                            @mouseleave="addHoverEffect"
                            @dragstart="dragStart($event, element, index)"
                        />
                    </div>
                </template>
            </VueDraggable>
        </div>
        <Handle
            type="source"
            :class="{ 'not-connected': !isSource || isCondition }"
            :position="Position.Right"
            :connectable="!isSource || isCondition"
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
        background-color: var(--node-hover);
        box-shadow: 0 2px 5px 0 var(--shadow-outer);
    }
}

.node-item {
    transition: all .2s linear;
    transition: text .2s linear;
}

.vue-flow__handle {
    width: 12px;
    height: 12px;
    top: calc(30px + 1rem + 1px);
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

.node-item {
    transition: all .2s linear;
    transition: text .2s linear;
}
</style>