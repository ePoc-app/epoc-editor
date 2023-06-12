<script setup lang="ts">
import TextInput from './TextInput.vue';
import TextAreaInput from './TextAreaInput.vue';
import FileInput from './FileInput.vue';
import ScoreInput from './ScoreInput.vue';

import CheckBoxInput from './card/components/CheckBoxInput.vue';
import RadioInput from './card/components/RadioInput.vue';
import SelectInput from './card/components/SelectInput.vue';
import RepeatInput from './RepeatInput.vue';
import HtmlInput from './HtmlInput.vue';
import { Input } from '@/src/shared/interfaces';

defineProps<{
    input: Input;
    inputValue;
    icon?: string;
    insideCard?: boolean;
    pos?: number;
    fieldIndex?: number;
}>();

const emit = defineEmits<{
    (e: 'input', value: string): void;
    (e: 'repeatInput', value): void;
    (e: 'check', value: boolean): void;
    (e: 'saveGivenState', state: string): void;
}>();

</script>

<template>
    <TextInput
        v-if="input.type === 'text'"
        :label="input.label"
        :placeholder="input.placeholder"
        :input-value="inputValue"
        :inside-card="insideCard"
        @input="emit('input', $event)"
        @save-given-state="emit('saveGivenState', $event)"
    />
    <HtmlInput
        v-if="input.type === 'html'"
        :label="input.label"
        :placeholder="input.placeholder"
        :input-value="inputValue"
        :inside-card="insideCard"
        @input="emit('input', $event)"
        @save-given-state="emit('saveGivenState', $event)"
    />
    <TextAreaInput 
        v-if="input.type === 'textarea'"
        :label="input.label"
        :placeholder="input.placeholder"
        :input-value="inputValue"
        :inside-card="insideCard"
        @input="emit('input', $event)"
        @save-given-state="emit('saveGivenState', $event)"
    />
    <FileInput 
        v-if="input.type === 'file'"
        :label="input.label"
        :accept="input.accept"
        :input-value="inputValue"
        :placeholder="input.placeholder"
        @input="emit('input', $event)"
        @save-given-state="emit('saveGivenState', $event)"
    />
    <ScoreInput
        v-if="input.type === 'score'"
        :label="input.label"
        :input-value="inputValue"
        @input="emit('input', $event)"
        @save-given-state="emit('saveGivenState', $event)"
    />
    <CheckBoxInput
        v-if="input.type === 'checkbox'"
        :label="input.label"
        :input-value="inputValue"
        :pos="pos"
        @change="emit('check', $event)"
        @save-given-state="emit('saveGivenState', $event)"
    />
    <RadioInput
        v-if="input.type === 'radio-group'"
        :label="input.label"
        :input-value="inputValue"
        :pos="pos"
        @change="emit('input', $event)"
        @save-given-state="emit('saveGivenState', $event)"
    />
    <SelectInput 
        v-if="input.type === 'select'"
        :label="input.label"
        :placeholder="input.placeholder"
        :input-value="inputValue"
        :options="input.options"
        :linked-options="input.linkedOptions"
        @change="emit('input', $event)"
        @save-given-state="emit('saveGivenState', $event)"
    />
    <RepeatInput
        v-if="input.type === 'repeat'"
        :label="input.label"
        :placeholder="input.placeholder"
        :input-values="inputValue"
        :inputs="input.inputs"
        :field-index="fieldIndex"
        :add-button="input.addButton"
        @change="emit('repeatInput', $event)"
        @save-given-state="emit('saveGivenState', $event)"
    />
</template>