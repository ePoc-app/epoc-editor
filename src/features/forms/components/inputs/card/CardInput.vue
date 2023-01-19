
<script setup lang="ts">
import TextAreaInput from '../TextAreaInput.vue';
import CheckBoxInput from './components/CheckBoxInput.vue';
import SelectInput from './components/SelectInput.vue';
import RadioInput from './components/RadioInput.vue';

defineProps<{
    inputValue: string;
    pos: number;
    type?: string;
    isLast: boolean;
    placeholder: string;
    title: string;

    isChecked?: boolean;
    selectedOption?: string;
    selectedRadio?: number;
    selectOptionsLength?: number;
}>();

const emit = defineEmits<{
    (e: 'input', value: string): void;

    (e: 'deleteCard'): void;
    (e: 'moveUpCard'): void;
    (e: 'moveDownCard'): void;

    (e: 'check', value: boolean): void;
    (e: 'radioCheck', value: number): void;
}>();

</script>

<template>
    <Transition>
        <div
            class="card draggable-card"
        >
            <div class="card-header">
                <h3>{{ title }} {{ pos }}</h3>
                <div class="card-header-icon">
                    <i class="icon-supprimer" @click="emit('deleteCard')"></i>
                    <hr v-if="!(isLast && pos === 1)" class="vertical-separator">
                    <i v-if="!isLast" class="icon-bas" @click="emit('moveDownCard')"></i>
                    <i v-if="pos !== 1" class="icon-haut" @click="emit('moveUpCard')"></i>
                    <hr class="vertical-separator">
                    <i class="icon-glisser"></i>
                </div>
            </div>
            <div class="card-content">
                <TextAreaInput
                    label=""
                    :inside-card="true"
                    :placeholder="placeholder"
                    :input-value="inputValue"
                    @input="emit('input', $event)"
                />
            </div>
            <CheckBoxInput v-if="type === 'check'" :is-checked="isChecked" @check="emit('check', $event)" />
            <SelectInput
                v-if="type === 'dd'"
                :label="'À quelle catégorie appartient cette réponse ' + pos"
                :selected="selectedOption"
                :options-length="selectOptionsLength"
            />
            <SelectInput v-if="type === 'reorder'" label="Position affiché à l'écran avant réorganisation" :selected="selectedOption" />
            <SelectInput
                v-if="type === 'list'"
                label="Réponse"
                :selected="selectedOption"
                :options-length="selectOptionsLength"
            />
            <RadioInput
                v-if="type === 'swipe'"
                :index="pos"
                :radio-value="selectedRadio"
                @radio-check="emit('radioCheck', $event)"
            />
        </div>
    </Transition>
</template>

<style scoped lang="scss">
.card {
    border: 1px solid var(--border);
    width: 25rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    cursor: move;
    transition: all .2s linear;
    &-header {
        padding: 0 .7rem;
        border-bottom: 1px solid var(--border);
        display: flex;
        flex-direction: row;
        
        h3 {
            font-weight: bold;
            font-size: 1rem;
            margin: .7rem 0;
            flex-grow: 1;
        }
        &-icon {
            display: flex;
            flex-direction: row;
            width: fit-content;
            text-align: end;
            margin: auto;
            hr {
                margin-right: .5rem;
            }
            i {
                cursor: pointer;
                color: var(--editor-grayblue);
                margin: auto;
                &:not(:last-child) {
                    margin-right: .5rem;
                }
            }
        }
    }
    &-content {
        padding: .7rem;
    }
    &.ghost {
        background-color: var(--item-background);
        border: 2px dashed var(--border);
        * {
            opacity: 0;
        }
    }
}
</style>