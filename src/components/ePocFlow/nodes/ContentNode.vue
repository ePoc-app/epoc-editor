

<script setup lang="ts">
//@ts-nocheck
import { Handle, useVueFlow } from '@vue-flow/core';
import ContentButton from '../../ContentButton.vue';
import { onMounted } from 'vue';

const props = defineProps<{
    id: string;
    data: {
        type: object;
        required: true;
    }
}>();

//? This add an animation when the node is added to the flow
onMounted(() => {
    document.querySelector('#node'+props.id).classList.add('node');
});

//TODO: Seriously think about refactoring this
let dragOverCount = 0;

function dragOver() {
    dragOverCount ++;
    if(dragOverCount > 25) {
        dragOverCount = 0;
        nodes.value.find(element => element.id === props.id).data.readyToDrop = true;
        document.querySelector('#node'+props.id).classList.add('node-animate');
    }
}

//! The behavior of the event dragleave is not consistent & causes bugs
function dragLeave() {
    nodes.value.find(element => element.id === props.id).data.readyToDrop = false;
    document.querySelector('#node'+props.id).classList.remove('node-animate');
    dragOverCount = 0;
}

const { nodes } = useVueFlow();

</script>

<template>
    <div class="container" @dragover="dragOver" @dragleave="dragLeave">
        <Handle type="target" position="left" />
        <div :id="'node'+props.id">
            <ContentButton
                v-for="icon of props.data.icons"
                :key="icon"
                :icon="icon"
                :is-draggable="false"
                :class-list="{ 'btn-content-blue' : false }"
            />
        </div>
        <Handle type="source" position="right" />
    </div>
</template>

<style scoped lang="scss">
.node {
    padding: .7rem;
    background-color: var(--node);
    border-radius: 8px;
    border: 1px solid var(--border);
    transition: all .15s ease-in-out;
    :not(:first-child) {
        margin-top: .5rem;
    }

    &-animate {
        padding: 1rem;
        transition: all .15s ease-in-out;
    }
}

.vue-flow__handle {
    width: 12px;
    height: 12px;
    &-left {
        left: -6px;
    }
    &-right {
        right: -6px;
    }
}

.container {
    margin: 1rem;
}
</style>