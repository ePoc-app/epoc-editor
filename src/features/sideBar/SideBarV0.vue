<script setup lang="ts">
import ModelMenuV0 from './components/ModelMenuV0.vue';

function startDragModel({event, sideAction, isScreen }) {
    event.dataTransfer.dropEffect = 'move';
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('sideAction', JSON.stringify(sideAction));
    event.dataTransfer.setData('isScreen', isScreen);
}

</script>

<template>
    <ModelMenuV0 @drag-start="startDragModel" />
</template>