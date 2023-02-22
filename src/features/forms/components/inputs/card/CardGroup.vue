<script setup lang="ts">
import { Card } from '@/src/shared/interfaces';
import AddCard from './AddCard.vue';
import CardInput from './CardInput.vue';
import draggable from 'vuedraggable';
import { ref } from 'vue';

defineProps<{
    type: string;
    cards: Card[];
    fieldName?: string;
    fieldIndex?: number;
}>();

const emit = defineEmits<{
    (e: 'addCard'): void;
    (e: 'deleteCard', index: number): void;
    (e: 'moveUpCard', index: number): void;
    (e: 'moveDownCard', index: number): void;
    (e: 'changeCards', event): void;
}>();

const drag = ref(false);

const dragOptions = ref({
    animation: 200,
    group: 'cards',
    disabled: false,
    ghostClass: 'ghost',
});

</script>

<template>
    <h3 v-if="fieldName" class="field-title"><span v-if="fieldIndex" class="field-index">{{ fieldIndex }}. </span>{{ fieldName }}</h3>
    <hr v-if="fieldName" class="separator">
    <draggable
        key="draggable"
        :model-value="cards"
        item-key="index"
        handle=".card-header"
        v-bind="dragOptions"
        filter=".fixed"
        @change="emit('changeCards', $event)"
        @start="drag = true"
        @end="drag = false"
    >
        <template #item="{element, index}">
            <CardInput
                :key="index"
                class="list-group-item"
                :pos="index + 1"
                :card="element"
                :is-last="index === cards.length - 1"
                @input="element.value = $event"
                @delete-card="emit('deleteCard', index)"
                @move-up-card="emit('moveUpCard', index)"
                @move-down-card="emit('moveDownCard', index)"
            />
        </template>
    </draggable>
    <AddCard
        v-if="type !== 'component'"
        :placeholder="'Ajouter'"
        class="add-card"
        @click="emit('addCard')"
    />
</template>

<style lang="scss">

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}

</style>