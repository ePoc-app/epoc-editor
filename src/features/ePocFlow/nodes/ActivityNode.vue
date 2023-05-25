<script setup lang="ts">
import { Handle, Position, getConnectedEdges, useVueFlow } from '@vue-flow/core';
import { computed, ref } from 'vue';
import { useEditorStore } from '@/src/shared/stores';
import { NodeElement, SideAction } from '@/src/shared/interfaces';
import ContentButton from '@/src/components/ContentButton.vue';
import { addContentToPage, removeContentFromPage, changeContentOrder } from '@/src/shared/services/graph';

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
    filter: '.condition',
    sort: !isCondition.value,
    ghostClass: 'ghost',
    animation: 200,
});

function openForm(element: NodeElement) {
    editorStore.openFormPanel(element.id, element.formType, element.formValues, element.parentId);
}

function openPageForm(id, formType, formValues) {
    editorStore.openFormPanel(id, formType, formValues);
}

let counter = 0;

function dragLeave(event) {
    counter --;
    if (counter > 0) return;
    event.target.classList.remove('hover');
}

function dragEnter(event) {
    if(!editorStore.draggedElement) return;

    event.preventDefault();
    counter ++;
    if(props.data.type === 'question' || props.data.type === 'element') {
        event.target.classList.add('hover');
    } 
}

function dragOver() {
    if(!editorStore.draggedElement) return;

    counter = 1;

    const { element, type } = editorStore.draggedElement; 
    const isQuestion = type === 'nodeElement' ? true : !['video', 'text'].includes((element as SideAction[])[0].type);

    if(props.data.type === 'template' || !isQuestion) {
        document.body.classList.remove('cursor-allowed');
        document.body.classList.add('cursor-not-allowed');
    } else if(props.data.type === 'question') {
        document.body.classList.remove('cursor-not-allowed');
        document.body.classList.add('cursor-allowed');
    }
}

function change(event) {
    if(!editorStore.draggedElement) return;

    const { added, moved, removed } = event;

    if(added && dropped.value) {
        dropped.value = false;
        addContentToPage(currentNode.id, added.element, added.newIndex);
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
            <p class="node-title" :class="{ 'active': editorStore.openedElementId ? editorStore.openedElementId === props.id : false }">{{ currentNode.data.formValues?.title || 'Activité' }}</p>
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
                @dragenter="dragEnter"
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

.node{
    border: 2px dashed var(--dashed-border);
}

.vue-flow__node.selected .node {
    border: 2px dashed var(--editor-blue);
}

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