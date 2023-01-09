

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
    const node = document.querySelector('#node' + props.id);
    node.classList.add('node');
    if(props.data.animated) node.classList.add('node-creation-animation');
});

//TODO: Seriously think about refactoring this
let dragOverCount = 0;

function dragOver(event) {
    if(event.dataTransfer.types.length > 1) return;
    dragOverCount ++;
    if(dragOverCount > 25) {
        dragOverCount = 0;
        nodes.value.find(element => element.id === props.id).data.readyToDrop = true;
        document.querySelector('#node'+props.id).classList.add('node-animate');

        //? To be sure the counter is set to 1 when ready to drop
        counter = 1;
    }
}

//? This counter is used to avoid triggering dragLeave when not necessary
let counter = 0;

function dragLeave() {
    counter --;
    if (counter > 0) return;
    nodes.value.find(element => element.id === props.id).data.readyToDrop = false;
    document.querySelector('#node'+props.id).classList.remove('node-animate');
    dragOverCount = 0;
}

function dragEnter(event) {
    event.preventDefault();
    counter ++;
}

const { nodes } = useVueFlow();

</script>

<template>
    <Handle type="target" position="left" />
    <div
        :id="'node'+props.id"
        @dragover="dragOver"
        @dragleave="dragLeave"
        @dragenter="dragEnter"
    >
        <ContentButton
            v-for="icon of props.data.icons"
            :key="icon"
            :icon="icon"
            :is-active="false"
            :is-draggable="false"
            :class-list="{ 'btn-content-blue' : false }"
        />
    </div>
    <Handle type="source" position="right" />
</template>

<style scoped lang="scss">

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
</style>