<script setup lang="ts">
import TextInput from './TextInput.vue';
import TextAreaInput from './TextAreaInput.vue';
import FileInput from './FileInput.vue';
import ScoreInput from './ScoreInput.vue';
import HtmlInput from './HtmlInput.vue';

import CheckBoxInput from './card/components/CheckBoxInput.vue';
import RadioInput from './card/components/RadioInput.vue';
import SelectInput from './card/components/SelectInput.vue';
import RepeatInput from './RepeatInput.vue';

import BadgesInput from './badges/BadgesInput.vue';
import IconPicker from './badges/components/IconPicker.vue';
import ConditionInput from './badges/components/ConditionInput.vue';
import { Input, RepeatInputEvent } from '@/src/shared/interfaces';
import { computed } from 'vue';

const props = defineProps<{
    input: Input;
    inputValue: string | boolean | string[] | number;
    icon?: string;
    insideCard?: boolean;
    pos?: number;
    fieldIndex?: number;
}>();

const emit = defineEmits<{
    (e: 'input', value: string): void;
    (e: 'repeatInput', value: RepeatInputEvent): void;
    (e: 'check', value: boolean): void;
    (e: 'saveGivenState', state: string): void;
}>();

const inputId = computed(() => {
    if(props.pos !== undefined && props.pos !== null) {
        return `${props.input.id}-${props.pos}`;
    } else {
        return props.input.id;
    }
});

</script>

<template>
    <TextInput
        v-if="input.type === 'text'"
        :id="inputId"
        :label="input.label"
        :placeholder="input.placeholder"
        :input-value="inputValue as string"
        :inside-card="insideCard"
        @input="emit('input', $event)"
        @save-given-state="emit('saveGivenState', $event)"
    />
    <HtmlInput
        v-if="input.type === 'html'"
        :id="inputId"
        :label="input.label"
        :placeholder="input.placeholder"
        :input-value="inputValue as string"
        :inside-card="insideCard"
        @input="emit('input', $event)"
        @save-given-state="emit('saveGivenState', $event)"
    />
    <TextAreaInput 
        v-if="input.type === 'textarea'"
        :id="inputId"
        :label="input.label"
        :placeholder="input.placeholder"
        :input-value="inputValue as string"
        :inside-card="insideCard"
        @input="emit('input', $event)"
        @save-given-state="emit('saveGivenState', $event)"
    />
    <FileInput
        v-if="input.type === 'file'"
        :id="inputId"
        :label="input.label"
        :accept="input.accept"
        :input-value="inputValue as string"
        :placeholder="input.placeholder"
        :target-directory="input.targetDirectory"
        @input="emit('input', $event)"
        @save-given-state="emit('saveGivenState', $event)"
    />
    <ScoreInput
        v-if="input.type === 'score'"
        :id="inputId"
        :label="input.label"
        :input-value="Number(inputValue)"
        @input="emit('input', $event)"
        @save-given-state="emit('saveGivenState', $event)"
    />
    <CheckBoxInput
        v-if="input.type === 'checkbox'"
        :id="inputId"
        :label="input.label"
        :input-value="inputValue as boolean"
        @change="emit('check', $event)"
        @save-given-state="emit('saveGivenState', $event)"
    />
    <RadioInput
        v-if="input.type === 'radio-group'"
        :id="inputId"
        :label="input.label"
        :input-value="inputValue as string"
        :pos="pos"
        @change="emit('input', $event)"
        @save-given-state="emit('saveGivenState', $event)"
    />
    <SelectInput 
        v-if="input.type === 'select'"
        :id="inputId"
        :label="input.label"
        :placeholder="input.placeholder"
        :input-value="inputValue as string"
        :options="input.options"
        :linked-options="input.linkedOptions"
        @change="emit('input', $event)"
        @save-given-state="emit('saveGivenState', $event)"
    />
    <RepeatInput
        v-if="input.type === 'repeat'"
        :id="inputId"
        :label="input.label"
        :input-values="inputValue as string[]"
        :inputs="input.inputs"
        :field-index="fieldIndex"
        :add-button="input.addButton"
        @change="emit('repeatInput', $event)"
        @save-given-state="emit('saveGivenState', $event)"
    />
    <BadgesInput
        v-if="input.type === 'badge'"
        :input-value="inputValue as string[]"
    />
    <IconPicker
        v-if="input.type === 'icon-picker'" 
        :label="input.label"
        :input-value="inputValue as string"
        @input="emit('input', $event)"
    />
    <ConditionInput
        v-if="input.type === 'badge-conditions'" 
    />
</template>