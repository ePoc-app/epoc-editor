<script setup lang="ts">
import { SideAction } from '@/src/shared/interfaces';
import ContentButton from '@/src/components/ContentButton.vue';

defineProps<{
    element: SideAction;
    index: number;
    isDraggable?: boolean;
}>();

const emit = defineEmits<{
    (e: 'dragstart', event: DragEvent, element: SideAction): void;
}>();

function handleDragStart(event: DragEvent, element: SideAction) {
    emit('dragstart', event, element);
}
</script>

<template>
    <div>
        <ContentButton
            :key="index"
            v-tippy="{
                content: element.tooltip || element.label,
                placement: 'right',
                arrow: true,
                arrowType: 'round',
                animation: 'fade',
            }"
            :data-testid="`${element.type}-content`"
            :icon="element.icon"
            :is-draggable="isDraggable"
            :class-list="{ 'btn-content-blue': true }"
            @dragstart="handleDragStart($event, element)"
        />
    </div>
</template>
