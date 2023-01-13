<script setup lang="ts">
import TextInput from './TextInput.vue';
import TextAreaInput from './TextAreaInput.vue';
import FileInput from './FileInput.vue';
import AddInput from './AddInput.vue';
import ResponseCard from './question/ReponseCard.vue';

defineProps<{
    type: string;
    label: string;
    inputValue: string;
    placeholder?: string;
    accept?: string;
    icon?: string;
    question?: {
        isLast?: boolean;
        pos: number;
    }
}>();

const emit = defineEmits<{
    //! This will surely be replaced by input event
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
    <AddInput
        v-if="type === 'add'"
        :placeholder="placeholder"
        :label="label"
    />
    <ResponseCard
        v-if="type === 'response'"
        :pos="question.pos"
        :is-last="question.isLast"
        :input-value="inputValue"
        @input="emit('input', $event)"
    />
</template>