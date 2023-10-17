<script setup lang="ts">
import { getCurrentState } from '@/src/shared/services/undoRedo.service';


const props = defineProps<{
    id: string;
    inputValue: string;
    label: string;
}>();

const emit = defineEmits<{
    (e: 'input', value: string): void;
    (e: 'saveGivenState', state: string): void;
}>();

function minus(inputValue: string) {
    savedValue = getCurrentState(true);
    const value = Number(inputValue) - 1;

    emit('input', `${value}`);
    emit('saveGivenState', savedValue);
}

function plus(inputValue: string) {
    savedValue = getCurrentState(true);
    const value = Number(inputValue) + 1;

    emit('input', `${value}`);
    emit('saveGivenState', savedValue);
}


// Undo Redo
let savedState = '';
let savedValue = '';

function onFocus() {
    savedValue = props.inputValue;
    savedState = getCurrentState(true);
}

function onBlur() {
    if (savedValue !== props.inputValue) {
        emit('saveGivenState', savedState);
    }
}

</script>

<template>
    <label :for="id">{{ label }}</label>
    <div class="input-score">
        <button @click="minus(inputValue)"><i class="icon-minus-circle"></i></button>
        <input
            :id="id"
            type="number"
            :value="inputValue"
            @input="emit('input', ($event.target as HTMLInputElement).value)"
            @focus="onFocus"
            @blur="onBlur"
        >
        <button @click="plus(inputValue)"><i class="icon-plus-circle"></i></button>
    </div>
</template>

<style scoped lang="scss">
.input-score {
    background-color: var(--item-background);
    border: 1px solid var(--border);
    border-radius: 4px;
    width: fit-content;
    margin-bottom: 1.5rem;

    input[type="number"] {
        border: none;
        margin: .5rem;
        background-color: transparent;
        font-size: 1.1rem;
        outline: none;
        color: var(--editor-grayblue);
        width: 4rem;
        text-align: center;
        &::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
    }
    
    button {
        border: none;
        background-color: transparent;
        font-size: 1.4rem;
        outline: none;
        color: var(--editor-grayblue);
        cursor: pointer;
        height: 100%;

        &:hover {
            transition: all 0.2s ease-in-out;
            background-color: rgba(0, 0, 0, 0.1);
            filter: brightness(80%);
        }
    }

    i {
        display: block;
    }
}

label {
    margin-bottom: .5rem;
    font-size: 1rem;
}
</style>