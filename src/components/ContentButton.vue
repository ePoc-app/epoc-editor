<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
    icon: string;
    isDraggable: boolean;
    classList?: object;
    subtitle?: string;
    isActive?: boolean;
    isContent?: boolean;
}>();

const emit = defineEmits<{
    (e: 'click', event): void;
    (e: 'contextmenu', event): void;
}>();

const contentButton = ref<HTMLElement>(null);

function click(event) {
    emit('click', event);
}

function contextMenu(event) {
    emit('contextmenu', event);
    contentButton.value.classList.add('selected');
}

</script>

<template>
    <div
        ref="contentButton"
        class="btn btn-content"
        :class="[classList, { 'draggable': isDraggable }, { 'active': isActive }]"
        :draggable="isDraggable"    
        @click.stop="click"
        @contextmenu.stop="contextMenu"
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

.selected {
    border: 2px solid var(--editor-blue);
    box-shadow: 0 1px 8px 0 var(--editor-blue-shadow);  
}
</style>