<script setup lang="ts">
import { Input } from '../../../../../shared/interfaces';
import AddCard from './AddCard.vue';
import CardInput from './CardInput.vue';
import draggable from 'vuedraggable';

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
    (e: 'swapCard', event): void;
}>();

//? Use this to get the text for the differents card
//? This way doesn't seem to be optimal
const cardMap = new Map([
    ['check', 'Réponse'],
    ['objective', 'Objectif']
]);

</script>

<template>
    <h3 v-if="fieldName" class="field-title"><span v-if="fieldIndex" class="field-index">{{ fieldIndex }}. </span>{{ fieldName }}</h3>
    <hr v-if="fieldName" class="separator">
    <draggable
        :model-value="inputs"
        item-key="index"
        handle=".card-header"
        ghost-class="ghost"
        @change="emit('swapCard', $event)"
    >
        <template #item="{element, index}">
            <CardInput
                :pos="index + 1"
                :type="type"
                :is-last="index === inputs.length - 1"
                :input-value="element.value"
                :placeholder="'Saisissez...'"
                :title="cardMap.get(type)"
                @input="element.value = $event"
                @delete-card="emit('deleteCard', index)"
                @move-up-card="emit('moveUpCard', index)"
                @move-down-card="emit('moveDownCard', index)"
            />
        </template>
    </draggable>
    <AddCard 
        :placeholder="'Ajouter'"
        class="add-card"
        @click="emit('addCard')"
    />
</template>