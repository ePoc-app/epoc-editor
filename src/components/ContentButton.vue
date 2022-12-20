<script setup lang="ts">

const props = defineProps<{
    icon: string;
    classList: object;
    isActive?: boolean;
    isDraggable: boolean;
}>();

const emit = defineEmits<{
    (e: 'click'): void;
}>();

function click() {
    emit('click');
}
</script>

<template>
    <button
        class="btn btn-content"
        :draggable="isDraggable"
        :class="[classList, { active: props.isActive }]"
        @click="click"
    >
        <i :class="icon" />
    </button>
</template>

<style>

</style>