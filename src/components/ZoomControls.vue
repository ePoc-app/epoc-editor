<script setup lang="ts">
import { computed, ref } from 'vue';
import { useVueFlow } from '@vue-flow/core';

const { zoomTo, fitView, onViewportChangeEnd, getViewport } = useVueFlow('main');

const zoom = ref(1);
const zoomString = computed(() => `${Math.round(zoom.value * 100)}%`);

zoomTo(zoom.value);

onViewportChangeEnd((event) => {
    zoom.value = event.zoom;
});

function zoomIn() {
    const newZoom = Math.min(zoom.value + 0.2, 1.5);
    zoom.value = newZoom;
    zoomTo(newZoom, { duration: 300 });
}

function zoomOut() {
    const newZoom = Math.max(zoom.value - 0.2, 0.4);
    zoom.value = newZoom;
    zoomTo(newZoom, { duration: 300 });
}

async function adjustView() {
    await fitView({ duration: 300 });
    zoom.value = getViewport().zoom;
}
</script>

<template>
    <div class="zoom-controls">
        <button
            v-tippy="{
                content: $t('zoom.zoomOut'),
                placement: 'top',
                arrow: true,
                arrowType: 'round',
                animation: 'fade',
            }"
            class="zoom-btn"
            @click="zoomOut"
        >
            <i class="icon-minus"></i>
        </button>
        <button
            v-tippy="{
                content: $t('zoom.adjust'),
                placement: 'top',
                arrow: true,
                arrowType: 'round',
                animation: 'fade',
            }"
            class="zoom-percentage"
            @click="adjustView"
        >
            {{ zoomString }}
        </button>
        <button
            v-tippy="{
                content: $t('zoom.zoomIn'),
                placement: 'top',
                arrow: true,
                arrowType: 'round',
                animation: 'fade',
            }"
            class="zoom-btn"
            @click="zoomIn"
        >
            <i class="icon-plus1"></i>
        </button>
    </div>
</template>

<style scoped lang="scss">
.zoom-controls {
    position: absolute;
    bottom: 1.5rem;
    left: 1.5rem;
    display: flex;
    gap: 0.5rem;
    background-color: var(--content);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    padding: 0.3rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
    user-select: none;
}

.zoom-btn,
.zoom-percentage {
    background-color: var(--content);
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.25rem;
    color: var(--text);
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;

    &:hover {
        background-color: var(--button-blue);
    }

    &:active {
        background-color: var(--node-hover);
    }
}

.zoom-percentage {
    font-size: 0.9rem;
    min-width: 3.5rem;
}

i {
    font-size: 1.2rem;
}
</style>
