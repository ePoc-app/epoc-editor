<script setup lang="ts">
import { SideAction } from '@/src/shared/interfaces';
import ContentButton from '@/src/components/ContentButton.vue';
import { computed } from 'vue';

const props = defineProps<{
    content: SideAction;
    isDraggable?: boolean;
    isActive?: boolean;
    classList?: Record<string, boolean>;
    placement?: 'right' | 'left' | 'top' | 'bottom';
}>();

const emit = defineEmits<{
    (e: 'click'): void;
    (e: 'dragstart', event: DragEvent): void;
    (e: 'dragend', event: DragEvent): void;
}>();

const defaultClassList = computed(() => ({
    'btn-content-blue': props.isDraggable,
    clickable: !props.isDraggable,
    active: props.isActive,
    ...props.classList,
}));

const tippyConfig = computed(() => ({
    content: props.content.tooltip || props.content.label,
    placement: props.placement || 'right',
    arrow: true,
    arrowType: 'round',
    animation: 'fade',
}));
</script>

<template>
    <ContentButton
        v-tippy="tippyConfig"
        :data-testid="`${content.type}-content`"
        :icon="content.icon"
        :is-draggable="isDraggable"
        :class-list="defaultClassList"
        :is-active="isActive"
        @click="emit('click')"
        @dragstart="emit('dragstart', $event)"
        @dragend="emit('dragend', $event)"
    />
</template>

<style scoped lang="scss">
.active {
    border: 2px solid var(--editor-blue);
    color: var(--editor-blue);
    box-shadow: 0 1px 8px 0 var(--editor-blue-shadow);
    transition: all 0.15s ease-in-out;
}
</style>
