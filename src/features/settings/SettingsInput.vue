<script setup lang="ts">
import ToggleInput from './ToggleInput.vue';
import { useVModel } from '@vueuse/core';
import UiSelect from '@/src/components/ui/UiSelect.vue';

const props = defineProps<{
    type: 'toggle' | 'select';
    label: string;
    modelValue: boolean | string;
    options?: {
        label: string;
        value: string;
    }[];
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
}>();

const data = useVModel(props, 'modelValue', emit);

const id = 'id' + Math.random().toString(16).slice(2);
</script>

<template>
    <div class="settings-input">
        <label :for="id">{{ label }}</label>
        <ToggleInput v-if="type === 'toggle'" :id="id" v-model="data" />
        <UiSelect v-else-if="type === 'select'" :id="id" v-model="data" :options="options" />
    </div>
</template>

<style scoped lang="scss">
.settings-input {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
