<script setup lang="ts">
import { Position, getSimpleBezierPath } from '@vue-flow/core';
import { computed } from 'vue';

const props = defineProps({
    sourceX: {
        type: Number,
        required: true,
    },
    sourceY: {
        type: Number,
        required: true,
    },
    targetX: {
        type: Number,
        required: true,
    },
    targetY: {
        type: Number,
        required: true,
    },
    targetPosition: {
        type: String,
        required: true,
    },
    sourcePosition: {
        type: String,
        required: true,
    },
});

const path = computed(() =>
    getSimpleBezierPath({
        sourceX: props.sourceX,
        sourceY: props.sourceY,
        sourcePosition: props.sourcePosition as Position,
        targetX: props.targetX,
        targetY: props.targetY,
        targetPosition: props.targetPosition as Position,
    }),
);
</script>

<template>
    <g>
        <path :d="path[0]" class="vue-flow__connection-path--custom" :stroke-width="2.5" fill="none" stroke="#384257" />
        <circle :cx="targetX" :cy="targetY" fill="#384257" stroke="#384257" :r="3" :stroke-width="2.5" />
    </g>
</template>
