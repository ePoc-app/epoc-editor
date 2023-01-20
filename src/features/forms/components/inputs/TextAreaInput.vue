<script setup lang="ts">

defineProps<{
    label: string;
    placeholder: string;
    inputValue: string;
    insideCard?: boolean;
    classList?: string;
}>();

const emit = defineEmits<{
    (e: 'input', value: string): void;
}>();

</script>

<template>
    <label class="input-label" :for="label">{{ label }}</label>
    <textarea
        :id="label"
        class="input input-textarea"
        :class="{ 'input-card' : insideCard }"
        :placeholder="placeholder"
        :value="inputValue"
        @input="emit('input', ($event.target as HTMLInputElement).value)"
    ></textarea>
</template>