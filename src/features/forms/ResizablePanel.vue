<script setup lang="ts">
import FormPanel from './FormPanel.vue';
import { computed, onMounted, ref, Ref, watch } from 'vue';
import { useEditorStore } from '@/src/shared/stores';

const editorStore = useEditorStore();

function handleKeyDown(event: KeyboardEvent) {
    const { key, metaKey, ctrlKey } = event;

    if (metaKey || ctrlKey) {
        if (key === 'v') {
            event.stopPropagation();
        }
    }
}

const panel: Ref<HTMLDivElement | null> = ref(null);
const resizeHandle: Ref<HTMLDivElement | null> = ref(null);

const resizing = ref(false);
let startWidth = 0;
let startX = 0;
function startResize(event: MouseEvent) {
    resizing.value = true;
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResize);
    if (!panel.value) return;

    startWidth = panel.value.offsetWidth;
    startX = event.clientX;
}

function resize(event: MouseEvent) {
    if (!panel.value) return;

    const newWidth = startWidth - (event.clientX - startX);
    panel.value.style.width = `${newWidth}px`;
}

function stopResize() {
    window.removeEventListener('mousemove', resize);
    window.removeEventListener('mouseup', stopResize);
    resizing.value = false;

    editorStore.formPanel.width = panel.value?.offsetWidth || 0;
    isMaximized.value = panel.value.getBoundingClientRect().x <= 100;
}

const isMaximized = ref(false);

function maximize() {
    if (!panel.value) return;

    const styles = getComputedStyle(panel.value);
    panel.value.style.width = styles.maxWidth;

    editorStore.formPanel.width = panel.value.offsetWidth;
    isMaximized.value = true;
}

function minimize() {
    if (!panel.value) return;

    panel.value.style.width = 'auto';

    editorStore.formPanel.width = panel.value.offsetWidth;
    isMaximized.value = false;
}

onMounted(() => {
    if (!editorStore.formPanel.width) return;

    panel.value.style.width = `${editorStore.formPanel.width}px`;
    isMaximized.value = panel.value.getBoundingClientRect().x <= 100;
});
</script>

<template>
    <div v-if="resizing" class="overlay" @mouseup="stopResize"></div>
    <div ref="panel" class="panel" @keydown="handleKeyDown">
        <div ref="resizeHandle" class="resize-handle" @mousedown="startResize"></div>
        <FormPanel :is-maximized="isMaximized" @maximize="maximize" @minimize="minimize" />
    </div>
</template>

<style scoped lang="scss">
.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    z-index: 999;
}

.panel {
    position: absolute;
    top: 80px;
    right: 0;
    height: calc(100% - 80px);
    width: 27rem;
    max-width: calc(100% - 100px - 2rem);
    min-width: 15rem;
    background-color: white;
    padding: 0 1rem;
    display: flex;
    flex-direction: column;
    overflow-y: auto;

    .resize-handle {
        position: fixed;
        width: 0.7rem;
        top: 80px;
        height: calc(100% - 80px);
        cursor: col-resize;
        transform: translateX(-1rem);
        background-color: transparent;
        z-index: 1000;
    }
}
</style>
