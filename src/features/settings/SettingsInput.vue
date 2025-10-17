<script setup lang="ts">
import ToggleInput from './ToggleInput.vue';
import { useVModel } from '@vueuse/core';
import UiSelect from '@/src/components/ui/UiSelect.vue';
import { computed } from 'vue';

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
    (e: 'update:modelValue', value: boolean | string): void;
}>();

const data = useVModel(props, 'modelValue', emit);

const toggleData = computed({
    get: () => data.value as boolean,
    set: (value: boolean) => (data.value = value),
});

const selectData = computed({
    get: () => data.value as string,
    set: (value: string) => (data.value = value),
});

const id = 'id' + Math.random().toString(16).slice(2);
</script>

<template>
    <div class="settings-input">
        <label :for="id">{{ label }}</label>
        <ToggleInput v-if="type === 'toggle'" :id="id" v-model="toggleData" />
        <UiSelect v-else-if="type === 'select'" :id="id" v-model="selectData" :options="options" />
    </div>
</template>

<style lang="scss">
.settings-input {
    display: flex;
    align-items: center;
    justify-content: space-between;

    label {
        font-weight: 600;
    }
}
</style>
