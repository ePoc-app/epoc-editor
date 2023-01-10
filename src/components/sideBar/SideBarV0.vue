<script setup lang="ts">
import ModelMenuV0 from './components/ModelMenuV0.vue';

function startDragModel({event, sideAction}) {
    event.dataTransfer.dropEffect = 'move';
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('sideAction', JSON.stringify(sideAction));
}

</script>

<template>
    <ModelMenuV0 @drag-start="startDragModel" />
</template>