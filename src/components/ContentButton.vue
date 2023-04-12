<script setup lang="ts">

defineProps<{
    icon: string;
    isDraggable: boolean;
    classList?: object;
    subtitle?: string;
    isActive?: boolean;
}>();

const emit = defineEmits<{
    (e: 'click', event): void;
}>();

function click(event) {
    emit('click', event);
}
</script>

<template>
    <div
        class="btn btn-content"
        :class="[classList, { 'draggable': isDraggable }, { 'active': isActive }]"
        :draggable="isDraggable"    
        @click.stop="click($event)"
    >
        <i :class="icon" />
        <span v-if="subtitle" class="subtitle">{{ subtitle }}</span>
    </div>
</template>

<style scoped lang="scss">
.draggable {
    cursor: grab;
}

.clickable {
    cursor: pointer;
}
</style>