<script setup lang="ts">
import { useVModel } from '@vueuse/core';

const props = defineProps<{
    id: string;
    label: string;
    hint?: string;
    modelValue: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', vaule: boolean);
}>();

const data = useVModel(props, 'modelValue', emit);
</script>

<template>
    <div class="checkbox">
        <input :id="id" v-model="data" class="checkbox-input" type="checkbox" />
        <div class="input-label">
            <label :for="id">{{ label }}</label>
            <i
                v-if="hint"
                v-tippy="{
                    content: hint,
                    placement: 'top',
                    allowHTML: true,
                    arrow: true,
                    arrowType: 'round',
                    animation: 'fade',
                }"
                class="icon-help-circle"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
.checkbox {
    display: flex;
    margin: 1rem 0 0.5rem 0;
    input[type='checkbox'] {
        appearance: none;
        margin: 0 0.5rem 0 0;
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
            transition: 0.1s transform ease-in-out;
            border-radius: 4px;
            background-color: var(--editor-blue);
        }
    }
}

label {
    cursor: pointer;
}
</style>
