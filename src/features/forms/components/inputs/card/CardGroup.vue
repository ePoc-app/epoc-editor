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
    (e: 'deleteCard', index: number): void;
    (e: 'moveUpCard', index: number): void;
    (e: 'moveDownCard', index: number): void;
}>();

//? Use this to get the text for the differents card
//? This way doesn't seem to be optimal
const cardMap = new Map([
    ['check-placeholder', 'une réponse'],
    ['check', 'Réponse'],
    ['objective-placeholder', 'un objectif'],
    ['objective', 'Objectif']
]);

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
        :placeholder="'Saisissez ' + cardMap.get(type+'-placeholder')"
        :title="cardMap.get(type)"
        @input="input.value = $event"
        @delete-card="emit('deleteCard', index)"
        @move-up-card="emit('moveUpCard', index)"
        @move-down-card="emit('moveDownCard', index)"
    />
    <AddCard 
        :placeholder="'Ajouter ' + cardMap.get(type+'-placeholder')"
        @click="emit('addCard')"
    />
</template>