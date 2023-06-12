<script setup lang="ts">
import { getCurrentState } from '@/src/shared/services/undoRedo.service';


const props = defineProps<{
    label: string;
    placeholder: string;
    inputValue: string;
    insideCard?: boolean;
    classList?: string;
}>();

const emit = defineEmits<{
    (e: 'input', value: string): void;
    (e: 'saveGivenState', state: string): void;
}>();


// Undo Redo
let savedState = '';
let startValue = '';

function onFocus() {
    startValue = props.inputValue;
    savedState = getCurrentState(true);
}

function onBlur() {
    if(startValue !== props.inputValue) emit('saveGivenState', savedState);
    savedState = '';
    startValue = '';
}

</script>

<template>
    <label class="input-label" :for="label">{{ label }}</label>
    <textarea
        :id="label"
        class="input input-textarea"
        :class="{ 'input-card' : insideCard }"
        :placeholder="placeholder"
        :value="inputValue"
        @input="emit('input', ($event.target as HTMLInputElement).value)"
        @focus="onFocus"
        @blur="onBlur"
    ></textarea>
</template>