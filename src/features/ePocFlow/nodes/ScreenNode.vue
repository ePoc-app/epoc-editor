<script setup lang="ts">
import { Handle, Position, useVueFlow } from '@vue-flow/core';
import ContentButton from '@/src/components/ContentButton.vue';
import { onMounted, ref } from 'vue';
import { useEditorStore } from '@/src/shared/stores';
import { NodeElement } from '@/src/shared/interfaces';

const editorStore = useEditorStore();

const props = defineProps<{
    id: string;
    data: {
        type: object;
        required: true;
        readyToDrop: boolean;
        animated: boolean;
        elements: NodeElement[];
        isSource: boolean;
        isTarget: boolean;
    }
}>();


const { findNode } = useVueFlow({ id: 'main' });

const node = findNode(props.id);
const dropped = ref(false);

// This add an animation when the node is added to the flow
onMounted(() => {
    const node = document.querySelector('#node' + props.id);
    node.classList.add('node');
    if(props.data.animated) node.classList.add('node-creation-animation');
});

function openForm(element: NodeElement) {
    editorStore.openFormPanel(element.id, element.formType, element.formValues, element.parentId);
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
        } else {
            newElement = {
                id: editorStore.generateId(),
                parentId: props.id,
                action: event.added.element,
                formType: event.added.element.type,
                formValues: event.added.element.formValues,
            };
        }
        node.data.elements.splice(event.added.newIndex, 0, newElement);
        dropped.value = false;
        
        editorStore.addElementToScreen(node.id, event.added.element, event.added.newIndex);

    } if(event.moved) {
        const oldIndex = event.moved.oldIndex;
        const newIndex = event.moved.newIndex;
        
        editorStore.changeElementOrder(oldIndex, newIndex, props.id);

    } if(event.removed) {
        editorStore.removeElementFromScreen(event.removed.oldIndex, props.id);
    }
}

function drop() {
    dropped.value = true;
}

const isQuestion = ref(node.data.type === 'question');

const dragOptions = ref({
    group: {
        name: 'node',
        put: isQuestion,
    },
    filter: '.question-item',
    sort: isQuestion,
    ghostClass: 'ghost',
});

function dragStart(event, element: NodeElement, index: number) {
    event.dataTransfer.dropEffect= 'move';
    event.dataTransfer.effectAllowed= 'move';
    event.dataTransfer.setData('element', JSON.stringify(element));
    event.dataTransfer.setData('source', JSON.stringify({ parent: props.id, index: index}));
}

</script>

<template>
    <div
        @click="editorStore.openFormPanel(node.id, node.data.formType, node.data.formValues)"
    >
        <div class="container">
            <p class="node-title">{{ node.data.formValues?.title || 'Page' }}</p>
            <Handle
                :class="{ 'not-connected': !node.data.isTarget }"
                type="target"
                :position="Position.Left"
                :connectable="false"
            />
            <div
                :id="'node'+props.id"
                :class=" { 'active': editorStore.openedNodeId ? editorStore.openedNodeId === props.id : false }"
                class="node"
                @dragover="dragOver($event)"
                @dragleave="dragLeave($event)"
                @dragenter="dragEnter($event)"
            >
                <VueDraggable
                    :model-value="data.elements"
                    v-bind="dragOptions"
                    class="node-list"
                    item-key="id"
                    @change="change($event)"
                    @mousedown.stop
                    @drop.stop="drop()"
                    @dragenter="dragEnter($event)"
                >
                    <template #item="{ element, index }">
                        <div :class="{ 'question-item': !isQuestion }">
                            <ContentButton 
                                :key="index"
                                :icon="element.action.icon"
                                :is-active="editorStore.openedNodeId ? editorStore.openedNodeId === element.id : false"
                                :is-draggable="isQuestion"
                                :class-list="{ 'btn-content-blue' : false, 'clickable': true, 'btn-content-node': true}"
                                @click="openForm(element)"
                                @dragstart="dragStart($event, element, index)"
                            />
                        </div>
                    </template>
                </VueDraggable>
            </div>
            <Handle
                :class="{ 'not-connected': !node.data.isSource }"
                type="source"
                :position="Position.Right"
                :connectable="!node.data.isSource"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">

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
}
</style>