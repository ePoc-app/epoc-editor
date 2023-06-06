<script setup lang="ts">
import { ignoreUndoRedoOnFocus } from '@/src/shared/stores/undoRedo/functions';

defineProps<{
    label: string;
    placeholder?: string;
    inputValue: string;
    insideCard?: boolean
}>();

const emit = defineEmits<{
    (e: 'input', value: string): void;
}>();

</script>

<template>
    <label v-if="label !== ''" class="input-label" :for="label">{{ label }}</label>
    <input
        :id="label"
        class="input"
        :class="{ 'input-card' : insideCard }"
        type="text"
        :placeholder="placeholder"
        :value="inputValue"
        @input="emit('input', ($event.target as HTMLInputElement).value)"
        @keydown="ignoreUndoRedoOnFocus"
    >
</template>