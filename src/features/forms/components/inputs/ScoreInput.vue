<script setup lang="ts">

defineProps<{
    inputValue: string;
}>();

const emit = defineEmits<{
    (e: 'input', value: string): void;
}>();

function minus(inputValue: string) {
    const value = parseInt(inputValue) - 1;
    emit('input', value.toString());
}

function plus(inputValue: string) {
    const value = parseInt(inputValue) + 1;
    emit('input', value.toString());
}

</script>

<template>
    <label for="input-score">Score</label>
    <div id="input-score" class="input-score">
        <button @click="minus(inputValue)"><i class="icon-minus-circle"></i></button>
        <input
            type="number"
            :value="inputValue"
            @input="emit('input', ($event.target as HTMLInputElement).value)"
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