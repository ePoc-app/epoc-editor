<script setup lang="ts">
import ToggleInput from "./ToggleInput.vue";
import { useVModel } from '@vueuse/core';

const props = defineProps<{
    type: 'toggle';
    label: string;
    modelValue: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
}>();

const data = useVModel(props, 'modelValue', emit);

const id = "id" + Math.random().toString(16).slice(2)

</script>

<template>
    <div class="settings-input">
        <label :for="id">{{ label }}</label>
        <ToggleInput :id="id" v-model="data" />
    </div>
</template>

<style scoped lang="scss">

.settings-input {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
