<script setup lang="ts">
import FormPanel from './FormPanel.vue';
import { ref, Ref } from 'vue';

function handleKeyDown(event: KeyboardEvent) {
    const { key, metaKey, ctrlKey } = event;

    if(metaKey || ctrlKey) {
        if(key === 'v') {
            event.stopPropagation();
        }
    }
}

const panel: Ref<HTMLDivElement | null> = ref(null);
const resizeHandle: Ref<HTMLDivElement | null> = ref(null);

const resizing = ref(false);
let startWidth = 0;
let startX = 0;
let maxWidth = 0;
function startResize(event: MouseEvent) {
    console.log('startResize');
    resizing.value = true;
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResize);
    if(!panel.value) return;

    startWidth = panel.value.offsetWidth;
    startX = event.clientX;

    const vueFlow = document.querySelector('.vue-flow');

    //? remove the padding and the resize handle width
    maxWidth = vueFlow.clientWidth - 32;
}

function resize(event: MouseEvent) {
    if(!panel.value) return;

    const newWidth = startWidth - (event.clientX - startX);

    panel.value.style.width = `${newWidth}px`;
}

function stopResize() {
    window.removeEventListener('mousemove', resize);
    window.removeEventListener('mouseup', stopResize);
    resizing.value = false;
}

</script>

<template>
    <div v-if="resizing" class="overlay" @mouseup="stopResize"></div>
    <div ref="panel" class="panel" @keydown="handleKeyDown">
        <div ref="resizeHandle" class="resize-handle" @mousedown="startResize"></div>
        <FormPanel />
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
        width: .7rem;
        top: 80px;
        height: calc(100% - 80px);
        cursor: col-resize;
        transform: translateX(-1rem);
        background-color: transparent;
        z-index: 1000;
    }
}
</style>