<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
import ResizeOverlay from '@/src/components/ResizeOverlay.vue';

interface Props {
    initialWidth?: number;
    position?: 'left' | 'right';
    top?: string;
    minWidth?: string;
    maxWidth?: string;
    showControls?: boolean;
    title?: string;
    onResizeStart?: () => void;
    onResizeEnd?: (width: number) => void;
    onMaximize?: () => void;
    onMinimize?: () => void;
    onClose?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
    initialWidth: 0,
    position: 'right',
    top: '80px',
    minWidth: '15rem',
    maxWidth: 'calc(100% - 100px - 2rem)',
    showControls: true,
    title: '',
    onResizeStart: () => {},
    onResizeEnd: () => {},
    onMaximize: () => {},
    onMinimize: () => {},
    onClose: () => {},
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
const panelWidth = ref('27rem'); // Track width in reactive state

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
    panelWidth.value = `${newWidth}px`;
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
    panelWidth.value = styles.maxWidth;
    isMaximized.value = true;

    const width = panel.value.offsetWidth;
    props.onMaximize();
    emit('maximize');
    props.onResizeEnd(width);
    emit('resize-end', width);
}

function minimize() {
    if (!panel.value) return;
    panelWidth.value = 'auto';
    isMaximized.value = false;

    const width = panel.value.offsetWidth;
    props.onMinimize();
    emit('minimize');
    props.onResizeEnd(width);
    emit('resize-end', width);
}

function closePanel() {
    props.onClose();
    emit('close');
}

defineExpose({
    maximize,
    minimize,
    isMaximized: () => isMaximized.value,
});

onMounted(() => {
    if (!props.initialWidth) return;
    panelWidth.value = `${props.initialWidth}px`;
    if (panel.value) {
        isMaximized.value = panel.value.getBoundingClientRect().x <= 100;
    }
});
</script>

<template>
    <ResizeOverlay v-if="resizing" @mouseup="stopResize" />
    <div
        ref="panel"
        class="resizable-panel"
        :class="{
            'position-left': position === 'left',
            'position-right': position === 'right',
            resizing: resizing,
        }"
        :style="{
            top,
            minWidth,
            maxWidth: position === 'right' ? maxWidth : 'calc(100% - 100px - 2rem)',
            width: panelWidth,
        }"
    >
        <div
            ref="resizeHandle"
            class="resize-handle"
            :class="{ 'handle-left': position === 'left', 'handle-right': position === 'right' }"
            :style="{ top }"
            @mousedown="startResize"
        ></div>

        <div v-if="showControls" class="command-buttons">
            <button v-if="isMaximized" class="btn control-btn" @click="minimize" title="Minimize">
                <i class="icon-minimize-2"></i>
            </button>
            <button v-else class="btn control-btn" @click="maximize" title="Maximize">
                <i class="icon-maximize-2"></i>
            </button>
            <button class="btn control-btn" @click="closePanel" title="Close">
                <i class="icon-x"></i>
            </button>
        </div>

        <div v-if="title" class="panel-title">
            <h2>{{ title }}</h2>
        </div>

        <div class="panel-content">
            <slot :is-maximized="isMaximized" :maximize="maximize" :minimize="minimize" :close="closePanel" />
        </div>
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
    transition: width 0.3s ease;

    &.resizing {
        transition: none;
    }

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
        opacity: 0;
        transition: all 0.25s ease;
        border-radius: 3px;

        &:hover {
            opacity: 1 !important;
            background-color: var(--primary-color, #007bff);
            box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
        }

        &.handle-right {
            transform: translateX(-1rem);
        }

        &.handle-left {
            transform: translateX(calc(100% + 1rem));
        }
    }

    &:hover .resize-handle {
        opacity: 0.4;
        background-color: var(--border-color, #dee2e6);
    }
}

.command-buttons {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    gap: 0.5rem;
    z-index: 1001;

    .control-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 0.25rem;
        border: none;
        background: var(--background-secondary, #f8f9fa);
        color: var(--text-secondary, #6c757d);
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
            background: var(--background-hover, #e9ecef);
            color: var(--text-primary, #212529);
        }

        i {
            font-size: 0.875rem;
            margin: 0;
        }
    }
}

.panel-title {
    padding: 1rem 1rem 0 0;
    margin-top: 2.5rem;

    h2 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
    }
}

.panel-content {
    flex: 1;
    padding-top: 1rem;
    overflow-y: auto;
}
</style>
