<script setup lang="ts">
import { useVModel } from '@vueuse/core';
const props = defineProps<{
    id: string;
    label: string;
    placeholder?: string;
    modelValue: string;
    insideCard?: boolean;
}>();

const emit = defineEmits<{
    (e: 'input', value: string): void;
}>();

const data = useVModel(props, 'modelValue', emit);
</script>

<template>
    <input
        :id="id"
        v-model="data"
        class="input2"
        :class="{ 'input-card': insideCard }"
        type="text"
        :placeholder="placeholder"
    />
</template>

<style scoped lang="scss">
.input2 {
    background-color: var(--item-background);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0.5rem;
    font-size: 1.1rem;
    color: var(--text);
    outline: none;

    &::placeholder {
        color: var(--editor-grayblue);
    }
}
</style>
