<script setup lang="ts">
import { getCurrentState } from '@/src/shared/services/undoRedo.service';

defineProps<{
    id: string;
    inputValue: boolean;
    label: string;
}>();


const emit = defineEmits<{
    (e: 'change', value: boolean): void;
    (e: 'saveGivenState', state: string): void;
}>();

function onChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.checked;
    const state = getCurrentState(true);
    
    emit('change', value);
    emit('saveGivenState', state);
}

</script>

<template>
    <div class="checkbox">
        <input
            :id="id"
            class="checkbox-input"
            type="checkbox"
            :checked="inputValue"
            @change="onChange"
        >
        <label :for="id">{{ label }}</label>
    </div>
</template>

<style scoped lang="scss">
.checkbox {
    display: flex;
    margin: 1rem 0 .5rem 0;
    input[type="checkbox"] {
        appearance: none;
      margin: 0 .5rem 0 0;
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

label {
    cursor: pointer;
}
</style>