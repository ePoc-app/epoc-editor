<script setup lang="ts">
import { Input } from '../../../../../shared/interfaces';
import AddCard from './AddCard.vue';
import CardInput from './CardInput.vue';

defineProps<{
    type: string;
    inputs: Input[];
    fieldName?: string;
    fieldIndex?: number;
}>();

const emit = defineEmits<{
    (e: 'addCard'): void;
}>();

</script>

<template>
    <h3 v-if="fieldName" class="field-title"><span v-if="fieldIndex" class="field-index">{{ fieldIndex }}. </span>{{ fieldName }}</h3>
    <hr v-if="fieldName" class="separator">
    <CardInput
        v-for="(input, index) of inputs"
        :key="index"
        :pos="index + 1"
        :type="type"
        :is-last="index === inputs.length - 1"
        :input-value="input.value"
        @input="input.value = $event"
    />
    <AddCard 
        :placeholder="'Ajouter une autre réponse'"
        @click="emit('addCard')"
    />
</template>