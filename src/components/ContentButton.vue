<script setup lang="ts">

defineProps<{
    icon: string;
    classList: object;
    isActive: boolean;
    isDraggable: boolean;
    subtitle?: string;
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
        :class="[classList, { active: isActive }, { 'draggable': isDraggable }]"
        :draggable="isDraggable"
        @click.stop="click($event)"
    >
        <i :class="icon" />
        <span v-if="subtitle" class="subtitle">{{ subtitle }}</span>
    </div>
    <!-- <button
        class="btn btn-content"
        :draggable="isDraggable"
        :class="[classList, { active: isActive }, { 'draggable': isDraggable }]"
        @click="click($event)"
    >
        <i :class="icon" />
    </button> -->
</template>

<style scoped lang="scss">
.draggable {
    cursor: grab;
}

.clickable {
    cursor: pointer;
}
</style>