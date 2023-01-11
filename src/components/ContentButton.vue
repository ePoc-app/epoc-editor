<script setup lang="ts">

defineProps<{
    icon: string;
    classList: object;
    isActive: boolean;
    isDraggable: boolean;
}>();

const emit = defineEmits<{
    (e: 'click', event): void;
}>();

function click(event) {
    emit('click', event);
}
</script>

<template>
    <button
        class="btn btn-content"
        :draggable="isDraggable"
        :class="[classList, { active: isActive }, { 'draggable': isDraggable }]"
        @click="click($event)"
    >
        <i :class="icon" />
    </button>
</template>

<style scoped lang="scss">
.draggable {
    cursor: grab;
}

.clickable {
    cursor: pointer;
}
</style>