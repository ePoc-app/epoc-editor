<script setup lang="ts">
import { ignoreUndoRedoOnFocus } from '@/src/shared/stores/undoRedo/functions';

const props = defineProps<{
    label: string;
    placeholder: string;
    inputValue: string;
    insideCard?: boolean;
    classList?: string;
}>();

const emit = defineEmits<{
    (e: 'input', value: string): void;
    (e: 'add-undo-action', value: { oldValue: string, newValue: string }): void;
}>();

let initialValue = null;

function addUndoAction() {
    if(initialValue !== props.inputValue) {
        emit('add-undo-action', { oldValue: initialValue, newValue: props.inputValue });
    }
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
        @focus="initialValue = inputValue"
        @blur="addUndoAction"
        @keydown="ignoreUndoRedoOnFocus"
    ></textarea>
</template>