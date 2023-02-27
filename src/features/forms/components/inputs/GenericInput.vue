<script setup lang="ts">
import TextInput from './TextInput.vue';
import TextAreaInput from './TextAreaInput.vue';
import FileInput from './FileInput.vue';
import ScoreInput from './ScoreInput.vue';
import QuillEditor from './QuillEditor.vue';

import CheckBoxInput from './card/components/CheckBoxInput.vue';
import RadioInput from './card/components/RadioInput.vue';
import SelectInput from './card/components/SelectInput.vue';

defineProps<{
    type: string;
    label: string;
    inputValue: string;
    placeholder?: string;
    accept?: string;
    icon?: string;
    insideCard?: boolean;
    pos?: number;
}>();

const emit = defineEmits<{
    (e: 'input', value: string): void;
}>();

</script>

<template>
    <TextInput
        v-if="type === 'text'"
        :label="label"
        :placeholder="placeholder"
        :input-value="inputValue"
        :inside-card="insideCard"
        @input="emit('input', $event)"
    />
    <QuillEditor
        v-if="type === 'ql-editor'"
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
        :inside-card="insideCard"
        @input="emit('input', $event)"
    />
    <FileInput 
        v-if="type === 'file'"
        :label="label"
        :accept="accept"
        :input-value="inputValue"
        :placeholder="placeholder"
        @input="emit('input', $event)"
    />
    <ScoreInput
        v-if="type === 'score'"
        :label="label"
        :input-value="inputValue"
        @input="emit('input', $event)"
    />
    <CheckBoxInput
        v-if="type === 'checkbox'"
        :label="label"
        :input-value="inputValue"
        @change="emit('input', $event)"
    />
    <RadioInput
        v-if="type === 'radio-group'"
        :label="label"
        :input-value="inputValue"
        :pos="pos"
        @change="emit('input', $event)"
    />
    <SelectInput 
        v-if="type === 'select'"
        :label="label"
        :placeholder="placeholder"
        :input-value="inputValue"
        @change="emit('input', $event)"
    />
</template>