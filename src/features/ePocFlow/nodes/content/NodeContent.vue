<script setup lang="ts">
import ContentButton from '@/src/components/ContentButton.vue';

defineProps<{
    icon: string;
    isDraggable: boolean;
    isActive?: boolean;
    classList?: object;
    isCondition: boolean;
    connectedBadges: number;
}>();

const emit = defineEmits<{
    (e: 'closeFormPanel');
    (e: 'openFormPanel');
    (e: 'contextMenu');
    (e: 'dragStart', event: DragEvent);
    (e: 'mouseEnter');
    (e: 'mouseLeave');
}>();
</script>

<template>
    <div class="node-item" :class="{ condition: isCondition }">
        <div v-if="connectedBadges" class="badge-notification badge-notification-right">
            <img src="/img/badge/notification.svg" alt="notification" />
            <small>{{ connectedBadges }}</small>
        </div>
        <ContentButton
            :icon="icon"
            :is-draggable="isDraggable"
            :is-active="isActive"
            :class-list="classList"
            @click.exact="emit('openFormPanel')"
            @click.meta="emit('closeFormPanel')"
            @click.ctrl="emit('closeFormPanel')"
            @mousedown.stop
            @mouseenter="emit('mouseEnter')"
            @mouseleave="emit('mouseLeave')"
            @dragstart="emit('dragStart', $event)"
            @contextmenu="emit('contextMenu')"
        />
    </div>
</template>

<style scoped lang="scss">
.node-item {
    transition: all 0.2s linear;
    position: relative;
}
</style>
