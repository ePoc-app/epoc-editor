<script setup lang="ts">
import { Handle, Position, getConnectedEdges, useVueFlow } from '@vue-flow/core';
import { computed, ref } from 'vue';
import { useEditorStore } from '@/src/shared/stores';
import { NodeElement } from '@/src/shared/interfaces';
import ContentButton from '@/src/components/ContentButton.vue';

const editorStore = useEditorStore();

const props = defineProps<{
    id: string;
    data: {
        type: object;
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

const dragOptions = ref({
    animation: 200,
    group: {
        name: 'node',
        put: !isCondition.value,
    },
    filter: '.condition',
    sort: !isCondition.value,
    ghostClass: 'ghost',
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
    event.preventDefault();
    counter ++;
}

function dragOver(event) {
    counter = 1;
    event.target.classList.add('hover');
}

function change(event) {
    const { added, moved, removed } = event;
    const { data } = currentNode;

    if(added && dropped.value) {
        const { element } = added;
        let newElement: NodeElement;

        if(element.action) {
            newElement = { ...element, parentId: props.id };
        } else {
            newElement = {
                id: editorStore.generateId(),
                parentId: props.id,
                action: element,
                formType: element.type,
                formValues: element.formValues,
                contentId: editorStore.generateContentId(),
            };
        }

        data.elements.splice(added.newIndex, 0, newElement);
        dropped.value = false;

        const action = element.action || element;
        editorStore.addElementToPage(currentNode.id, action, added.newIndex);
    }

    if(moved) {
        const { oldIndex, newIndex } = moved;
        editorStore.changeElementOrder(oldIndex, newIndex, props.id);
    }

    if(removed) {
        const { oldIndex } = removed;
        editorStore.removeElementFromScreen(oldIndex, props.id, true);
    }
}

function drop() {
    dropped.value = true;
}

function dragStart(event, element: NodeElement, index: number) {
    event.dataTransfer.dropEffect= 'move';
    event.dataTransfer.effectAllowed= 'move';
    event.dataTransfer.setData('element', JSON.stringify(element));
    event.dataTransfer.setData('sourcePage', JSON.stringify({ parent: props.id, index: index}));
}

function closeFormPanel() {
    editorStore.closeFormPanel();
}

</script>

<template>
    <div>
        <div 
            class="container"
            @click.exact="openPageForm(currentNode.id, currentNode.data.formType, currentNode.data.formValues)"
            @click.meta="closeFormPanel"
            @click.ctrl="closeFormPanel"
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
                @change="change($event)"
                @drop.stop="drop()"
                @dragenter="dragEnter($event)"
                @dragover="dragOver($event)"
                @dragleave="dragLeave($event)"
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

.node-item {
    transition: all .2s linear;
    transition: text .2s linear;
}
</style>