<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
import ResizeOverlay from '@/src/components/ResizeOverlay.vue';

interface Props {
    initialWidth?: number;
    position?: 'left' | 'right';
    top?: string;
    minWidth?: string;
    maxWidth?: string;
    onResizeStart?: () => void;
    onResizeEnd?: (width: number) => void;
    onMaximize?: () => void;
    onMinimize?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
    initialWidth: 0,
    position: 'right',
    top: '80px',
    minWidth: '15rem',
    maxWidth: 'calc(100% - 100px - 2rem)',
    onResizeStart: () => {
        return;
    },
    onResizeEnd: () => {
        return;
    },
    onMaximize: () => {
        return;
    },
    onMinimize: () => {
        return;
    },
});

const emit = defineEmits<{
    (e: 'resize-start'): void;
    (e: 'resize-end', width: number): void;
    (e: 'maximize'): void;
    (e: 'minimize'): void;
}>();

const panel: Ref<HTMLDivElement | null> = ref(null);
const resizeHandle: Ref<HTMLDivElement | null> = ref(null);
const resizing = ref(false);
const isMaximized = ref(false);

let startWidth = 0;
let startX = 0;

function startResize(event: MouseEvent) {
    props.onResizeStart();
    emit('resize-start');

    resizing.value = true;
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResize);

    if (!panel.value) return;
    startWidth = panel.value.offsetWidth;
    startX = event.clientX;
}

function resize(event: MouseEvent) {
    if (!panel.value) return;
    const deltaX = props.position === 'right' ? -(event.clientX - startX) : event.clientX - startX;
    const newWidth = startWidth + deltaX;
    panel.value.style.width = `${newWidth}px`;
}

function stopResize() {
    window.removeEventListener('mousemove', resize);
    window.removeEventListener('mouseup', stopResize);
    resizing.value = false;

    const width = panel.value?.offsetWidth || 0;
    isMaximized.value = panel.value ? panel.value.getBoundingClientRect().x <= 100 : false;

    props.onResizeEnd(width);
    emit('resize-end', width);
}

function maximize() {
    if (!panel.value) return;
    const styles = getComputedStyle(panel.value);
    panel.value.style.width = styles.maxWidth;
    isMaximized.value = true;

    const width = panel.value.offsetWidth;
    props.onMaximize();
    emit('maximize');
    props.onResizeEnd(width);
    emit('resize-end', width);
}

function minimize() {
    if (!panel.value) return;
    panel.value.style.width = 'auto';
    isMaximized.value = false;

    const width = panel.value.offsetWidth;
    props.onMinimize();
    emit('minimize');
    props.onResizeEnd(width);
    emit('resize-end', width);
}

defineExpose({
    maximize,
    minimize,
    isMaximized: () => isMaximized.value,
});

onMounted(() => {
    if (!props.initialWidth || !panel.value) return;
    panel.value.style.width = `${props.initialWidth}px`;
    isMaximized.value = panel.value.getBoundingClientRect().x <= 100;
});
</script>

<template>
    <ResizeOverlay v-if="resizing" @mouseup="stopResize" />
    <div
        ref="panel"
        class="resizable-panel"
        :class="{ 'position-left': position === 'left', 'position-right': position === 'right' }"
        :style="{
            top,
            minWidth,
            maxWidth: position === 'right' ? maxWidth : 'calc(100% - 100px - 2rem)',
        }"
    >
        <div
            ref="resizeHandle"
            class="resize-handle"
            :class="{ 'handle-left': position === 'left', 'handle-right': position === 'right' }"
            :style="{ top }"
            @mousedown="startResize"
        ></div>
        <slot :is-maximized="isMaximized" :maximize="maximize" :minimize="minimize" />
    </div>
</template>

<style scoped lang="scss">
.side-menu-open {
    .resizable-panel.position-right {
        max-width: calc(100% - 80px - 2rem - 104px * 2 - 4rem);
    }
}

.resizable-panel {
    position: absolute;
    height: calc(100% - 80px);
    width: 27rem;
    background-color: white;
    padding: 0 1rem;
    display: flex;
    flex-direction: column;
    overflow-y: auto;

    &.position-right {
        right: 0;
    }

    &.position-left {
        left: 0;
    }

    .resize-handle {
        position: fixed;
        width: 0.7rem;
        height: calc(100% - 80px);
        cursor: col-resize;
        background-color: transparent;
        z-index: 1000;
        transition: all 0.25s ease;

        &:hover {
            opacity: 1;
            background-color: var(--border);
        }

        &.handle-right {
            transform: translateX(-1rem);
        }

        &.handle-left {
            transform: translateX(calc(100% + 1rem));
        }
    }
}
</style>
