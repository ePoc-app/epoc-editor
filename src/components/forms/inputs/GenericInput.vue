<script setup lang="ts">
import TextInput from './TextInput.vue';
import TextAreaInput from './TextAreaInput.vue';
import FileInput from './FileInput.vue';

defineProps<{
    type: string;
    label: string;
    placeholder?: string;
    accept?: string;
    inputValue: string;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'input', value: string): void;
}>();

</script>

<template>
    <TextInput
        v-if="type === 'text'"
        :label="label"
        :placeholder="placeholder"
        :input-value="inputValue"
        @input="emit('input', $event)"
    />
    <TextAreaInput 
        v-if="type === 'textarea'"
        :label="label"
        :placeholder="placeholder"
        :input-value="inputValue"
        @input="emit('input', $event)"
    />
    <FileInput 
        v-if="type === 'file'"
        :label="label"
        :accept="accept"
        @input="emit('update:modelValue', $event)"
    />
</template>