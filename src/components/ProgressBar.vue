<script setup lang="ts">
import { ProgressIndicator, ProgressRoot } from 'reka-ui';
defineProps<{
    max: number;
    modelValue: number;
}>();
</script>

<template>
    <div>
        <p class="status">{{ modelValue }}%</p>
        <ProgressRoot :model-value="modelValue" class="progress-root" style="transform: translateZ(0)">
            <ProgressIndicator class="progress-indicator" :style="`transform: translateX(-${100 - modelValue}%)`" />
        </ProgressRoot>
    </div>
</template>

<style scoped lang="scss">
.progress-root {
    position: relative;
    overflow: hidden;
    background: var(--background);
    border-radius: calc(infinity * 1px);
    width: 100%;
    height: 15px;

    transform: translateZ(0);
}

.progress-indicator {
    background-color: var(--editor-blue);
    width: 100%;
    height: 100%;
    transition: transform 660ms cubic-bezier(0.65, 0, 0.35, 1);
}

.status {
    text-align: center;
}
</style>
