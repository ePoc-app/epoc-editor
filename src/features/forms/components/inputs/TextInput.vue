<script setup lang="ts">
import { getCurrentState } from '@/src/shared/services/undoRedo.service';

const props = defineProps<{
    id: string;
    label: string;
    placeholder?: string;
    inputValue: string;
    insideCard?: boolean;
}>();

const emit = defineEmits<{
    (e: 'input', value: string): void;
    (e: 'saveGivenState', state: string): void;
}>();

// Undo Redo

let savedState = '';
let startValue = '';

function onFocus() {
    savedState = getCurrentState(true);

    startValue = props.inputValue;
}

function onBlur() {
    if (startValue !== props.inputValue) emit('saveGivenState', savedState);
    savedState = '';
    startValue = '';
}
</script>

<template>
    <input
        :id="id"
        class="input"
        :class="{ 'input-card': insideCard }"
        type="text"
        :placeholder="placeholder"
        :value="inputValue"
        @input="emit('input', ($event.target as HTMLInputElement).value)"
        @focus="onFocus"
        @blur="onBlur"
    />
</template>
