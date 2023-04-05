<script setup lang="ts">
import { Handle, Position, getConnectedEdges, useVueFlow } from '@vue-flow/core';
import ContentButton from '@/src/components/ContentButton.vue';
import { computed, ref } from 'vue';
import { useEditorStore } from '@/src/shared/stores';
import { NodeElement, SideAction } from '@/src/shared/interfaces';

const editorStore = useEditorStore();

const props = defineProps<{
    id: string;
    data: {
        type: string;
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
    if(!editorStore.draggedElement) return;

    event.preventDefault();
    counter ++;
    if(props.data.type === 'question') {
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
    document.body.classList.remove('cursor-not-allowed', 'cursor-allowed');
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
    animation: 200,
});

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

const isSource = computed(() => getConnectedEdges([node], edges.value).some((edge) => edge.source === props.id));
const isTarget = computed(() => getConnectedEdges([node], edges.value).some((edge) => edge.target === props.id));

const page = ref(null);
const isCondition = ref(node.data.type === 'condition');


</script>

<template>
    <div>
        <div 
            ref="page"
            class="container"
            @click.exact="openPageForm(node.id, node.data.formType, node.data.formValues)"
            @click.meta="closeFormPanel"
            @click.ctrl="closeFormPanel"
            @mouseenter="addHoverEffect"
            @mouseleave="removeHoverEffect"
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
                @change="change"
                @drop.stop="drop"
                @dragenter="dragEnter"
                @dragover.stop="dragOver"
                @dragleave="dragLeave"
            >
                <template #item="{ element, index }">
                    <div class="node-item" :class="{ 'question-item': !isQuestion }">
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
                            @mouseenter="removeHoverEffect"
                            @mouseleave="addHoverEffect"
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