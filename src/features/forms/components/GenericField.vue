<script setup lang="ts">
import { Input } from '../../../shared/interfaces';
import GenericInput from './inputs/GenericInput.vue';

defineProps<{
    inputs: Input[];
    fieldName?: string;
    fieldIndex?: number;
}>();

</script>

<template>
    <h3 v-if="fieldName" class="field-title"><span v-if="fieldIndex" class="field-index">{{ fieldIndex }}. </span>{{ fieldName }}</h3>
    <hr v-if="fieldName" class="separator">
    <!-- didn't find a solution using v-model -->
    <GenericInput 
        v-for="input in inputs"
        :key="input.type"
        :type="input.type"
        :label="input.label"
        :placeholder="input.placeholder"
        :accept="input.accept"
        :question="input.question"
        :input-value="input.value"
        @input="input.value = $event"
    />
</template>

<style scoped lang="scss">
</style>