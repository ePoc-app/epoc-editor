<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
    isChecked: boolean;
}>();

const label = ref('C\'est une bonne réponse');

const emit = defineEmits<{
    (e: 'input', value: string): void;
    (e: 'check', value: boolean): void;
}>();

</script>

<template>
    <div class="checkbox">
        <input
            :id="label"
            class="checkbox-input"
            type="checkbox"
            :checked="isChecked"
            @change="emit('check', ($event.target as HTMLInputElement).checked)"
        >
        <label :for="label">{{ label }}</label>
    </div>
</template>

<style scoped lang="scss">
.checkbox {
    display: flex;
    margin: 0 1rem 1rem 1rem;
    input[type="checkbox"] {
        appearance: none;
        margin: 0;
        margin-right: .5rem;
        font: inherit;
        width: 20px;
        height: 20px;
        border: 1px solid var(--border);
        border-radius: 4px;
        transform: translateY(-0.075em);
        background-color: var(--item-background);

        cursor: pointer;

        display: grid;
        place-content: center;
        
        &:checked::before {
            transform: scale(1);
        }

        &::before {
            content: '';
            width: 14px;
            height: 14px;
            transform: scale(0);
            transition: .1s transform ease-in-out;
            border-radius: 4px;
            background-color: var(--editor-blue);
        }
    }
}
</style>