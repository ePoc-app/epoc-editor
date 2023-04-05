<script setup lang="ts">
import { Handle, Position, getConnectedEdges, useVueFlow } from '@vue-flow/core';
import ContentButton from '@/src/components/ContentButton.vue';
import { computed, ref } from 'vue';
import { useEditorStore } from '@/src/shared/stores';
import { NodeElement } from '@/src/shared/interfaces';

const editorStore = useEditorStore();

const props = defineProps<{
    id: string;
    data: {
        type: object;
        required: true;
        readyToDrop: boolean;
        elements: NodeElement[];
        isSource: boolean;
        isTarget: boolean;
    }
}>();


const { findNode, edges } = useVueFlow({ id: 'main' });

const node = findNode(props.id);
const dropped = ref(false);

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
    event.preventDefault();
    counter ++;
}

function dragOver(event) {
    counter = 1;
    event.target.classList.add('hover');
}

function change(event) {
    if(event.added && dropped.value) {
        let newElement: NodeElement;
        if(event.added.element.action) {
            newElement = event.added.element;
            newElement.parentId = props.id;
        } else {
            newElement = {
                id: editorStore.generateId(),
                parentId: props.id,
                action: event.added.element,
                formType: event.added.element.type,
                formValues: event.added.element.formValues,
                contentId: editorStore.generateContentId(),
            };
        }
        node.data.elements.splice(event.added.newIndex, 0, newElement);
        dropped.value = false;

        const action = event.added.element.action ? event.added.element.action : event.added.element;

        editorStore.addElementToScreen(node.id, action, event.added.newIndex);

    } if(event.moved) {
        const oldIndex = event.moved.oldIndex;
        const newIndex = event.moved.newIndex;
        
        editorStore.changeElementOrder(oldIndex, newIndex, props.id);

    } if(event.removed) {
        editorStore.removeElementFromScreen(event.removed.oldIndex, props.id, true);
    }
}

function drop() {
    dropped.value = true;
}

const isQuestion = ref(node.data.type === 'question');
const isCondition = ref(node.data.type === 'condition');

const dragOptions = ref({
    group: {
        name: 'node',
        put: !isCondition.value,
    },
    filter: '.question-item',
    sort: !isCondition.value,
    ghostClass: 'ghost',
});

function dragStart(event, element: NodeElement, index: number) {
    event.dataTransfer.dropEffect= 'move';
    event.dataTransfer.effectAllowed= 'move';
    event.dataTransfer.setData('element', JSON.stringify(element));
    event.dataTransfer.setData('sourcePage', JSON.stringify({ parent: props.id, index: index}));
}

function closeFormPanel() {
    editorStore.closeFormPanel();
}

const isSource = computed(() => getConnectedEdges([node], edges.value).some((edge) => edge.source === props.id));
const isTarget = computed(() => getConnectedEdges([node], edges.value).some((edge) => edge.target === props.id));

</script>

<template>
    <div>
        <div 
            class="container"
            @click.exact="openPageForm(node.id, node.data.formType, node.data.formValues)"
            @click.meta="closeFormPanel"
            @click.ctrl="closeFormPanel"
            @mousedown="closeFormPanel"
        >
            <p class="node-title" :class="{ 'active': editorStore.openedNodeId ? editorStore.openedNodeId === props.id : false }">{{ node.data.formValues?.title || 'Page' }}</p>
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
                :class=" { 'active': editorStore.openedNodeId ? editorStore.openedNodeId === props.id : false }"
                @change="change($event)"
                @drop.stop="drop()"
                @dragenter="dragEnter($event)"
                @dragover="dragOver($event)"
                @dragleave="dragLeave($event)"
            >
                <template #item="{ element, index }">
                    <div :class="{ 'question-item': !isQuestion }">
                        <ContentButton
                            :key="index"
                            :icon="element.action.icon"
                            :is-active="editorStore.openedNodeId ? editorStore.openedNodeId === element.id : false"
                            :is-draggable="isQuestion"
                            :class-list="{ 'btn-content-blue' : false, 'clickable': true, 'btn-content-node': true }"
                            @click.exact="openForm(element)"
                            @click.meta="closeFormPanel"
                            @click.ctrl="closeFormPanel"
                            @mousedown.stop
                            @dragstart="dragStart($event, element, index)"
                        />
                    </div>
                </template>
            </VueDraggable>
            <Handle
                type="source"
                :class="{ 'not-connected': !isSource || isCondition }"
                :position="Position.Right"
                :connectable="!isSource || isCondition"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">

.node.hover:has(.ghost) {
    &.node-list {
        padding: 1.5rem;
    }
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
    position: relative
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