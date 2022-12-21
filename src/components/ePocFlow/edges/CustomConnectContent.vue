<script setup lang="ts">
defineProps({
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
});

//TODO: Maybe add a connect on snap when close to a node
</script>

<template>
    <g>
        <path
            class="vue-flow__connection"
            fill="none"
            stroke="#000000"
            :stroke-width="2.5"
            :d="`M${sourceX},${sourceY} C ${sourceX} ${targetY} ${sourceX} ${targetY} ${targetX},${targetY}`"
        />

        <circle
            :cx="targetX"
            :cy="targetY"
            fill="#fff"
            :r="4"
            stroke="#000000"
            :stroke-width="2.5"
        />
    </g>
</template>