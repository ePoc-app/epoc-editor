<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
import ResizeOverlay from './ResizeOverlay.vue';

interface Props {
    initialWidth?: number;
    position: 'left' | 'right';
    top?: string;
    minWidth?: string;
    maxWidth?: string;
    showControls?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    initialWidth: 0,
    position: 'right',
    top: '80px',
    minWidth: '15rem',
    maxWidth: 'calc(100% - 100px - 2rem)',
    showControls: true,
});

const emit = defineEmits<{
    (e: 'resizeStart'): void;
    (e: 'resizeEnd', width: number): void;
    (e: 'maximize'): void;
    (e: 'minimize'): void;
    (e: 'close'): void;
}>();

const panel: Ref<HTMLDivElement | null> = ref(null);
const resizeHandle: Ref<HTMLDivElement | null> = ref(null);
const resizing = ref(false);
const isMaximized = ref(false);
const panelWidth = ref('27rem');

let startWidth = 0;
let startX = 0;

function startResize(event: MouseEvent) {
    emit('resizeStart');

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

    emit('resizeEnd', width);
}

function maximize() {
    if (!panel.value) return;

    const styles = getComputedStyle(panel.value);
    panelWidth.value = styles.maxWidth;
    isMaximized.value = true;

    emit('maximize');
}

function minimize() {
    if (!panel.value) return;

    panelWidth.value = 'auto';
    isMaximized.value = false;

    emit('minimize');
}

function closePanel() {
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
    <ResizeOverlay v-if="resizing" />
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
            :style="{ top: '0' }"
            @mousedown="startResize"
        />

        <div v-if="showControls" class="command-buttons">
            <button v-if="isMaximized" class="btn" @click="minimize">
                <i class="icon-minimize-2"></i>
            </button>
            <button v-else class="btn" @click="maximize">
                <i class="icon-maximize-2"></i>
            </button>
            <button class="btn" @click="closePanel">
                <i class="icon-x"></i>
            </button>
        </div>

        <slot name="title" />

        <div class="panel-content">
            <slot :is-maximized="isMaximized" :maximize="maximize" :minimize="minimize" :close="closePanel" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.side-menu-open {
    .resizable-panel.position-right {
        max-width: calc(100% - 80px - 2rem - 104px * 2 - 4rem) !important;
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
        left: 100px;
    }

    .resize-handle {
        position: absolute;
        width: 0.7rem;
        height: calc(100vh - 80px);
        cursor: col-resize;
        z-index: 1000;
        transition: all 0.25s ease;

        &:hover {
            background-color: var(--border);
        }

        &.handle-right {
            transform: translateX(-1rem);
        }

        &.handle-left {
            right: 0;
            transform: translateX(0);
        }
    }
}

.command-buttons {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    gap: 1rem;
    padding: 1rem;

    button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.5rem;
        height: 1.5rem;
        z-index: 10;
        border-radius: 2rem;
        i {
            margin: 0;
            font-size: 14px;
            font-weight: 800;
            color: var(--text);
        }
    }
}

.panel-content {
    flex: 1;
    padding: 0 0.1rem 1rem 0.1rem;
    overflow-y: auto;
}
</style>
