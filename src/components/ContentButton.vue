<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
    icon: string;
    isDraggable: boolean;
    classList?: object;
    subtitle?: string;
    isActive?: boolean;
    isContent?: boolean;
    rotate?: boolean;
}>();

const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void;
    (e: 'contextmenu', event: MouseEvent): void;
}>();

const contentButton = ref<HTMLElement>(null);

function click(event: MouseEvent) {
    emit('click', event);
}

function contextMenu(event: MouseEvent) {
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
        <div class="text" :class="{ 'rotated': rotate }">
            <i :class="icon" />
            <span v-if="subtitle" class="subtitle">{{ subtitle }}</span>
        </div>
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

.text {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.rotated {
    transform: rotate(-45deg);
}
</style>