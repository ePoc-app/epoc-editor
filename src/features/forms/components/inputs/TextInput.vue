<script setup lang="ts">

defineProps<{
    label: string;
    placeholder?: string;
    inputValue: string;
}>();

const emit = defineEmits<{
    (e: 'input', value: string): void;
}>();

</script>

<template>
    <label v-if="label !== ''" class="input-label" :for="label">{{ label }}</label>
    <input
        :id="label"
        class="input"
        type="text"
        :placeholder="placeholder"
        :value="inputValue"
        @input="emit('input', ($event.target as HTMLInputElement).value)"
    >
</template>