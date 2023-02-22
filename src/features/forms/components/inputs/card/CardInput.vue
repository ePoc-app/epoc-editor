
<script setup lang="ts">
import { Card } from '@/src/shared/interfaces';
import GenericInput from '../GenericInput.vue';

defineProps<{
    pos: number;
    isLast: boolean;
    card: Card
}>();

const emit = defineEmits<{
    (e: 'input', value: string): void;

    (e: 'deleteCard'): void;
    (e: 'moveUpCard'): void;
    (e: 'moveDownCard'): void;

    (e: 'check', value: boolean): void;
    (e: 'radioCheck', value: number): void;
}>();

const questions = ['qcm', 'dragdrop', 'reorder', 'swipe', 'list'];

function isQuestion(type: string): boolean {
    return questions.includes(type);
}

</script>

<template>
    <Transition>
        <div class="card draggable-card">
            <div class="card-header" :class="{ 'border-bottom': card.type !== 'component', 'fixed': card.action && !isQuestion(card.action.type) }">
                <div v-if="card.type === 'component'" class="form-icon"><i :class="card.action.icon"></i></div>
                <h3 v-if="card.type === 'component'">{{ card.action.label }}</h3>
                <h3 v-else>{{ card.label }} {{ pos }}</h3>
                <div class="card-header-icon">
                    <i class="icon-supprimer delete" @click="emit('deleteCard')"></i>
                    <hr v-if="!(isLast && pos === 1)" class="vertical-separator">
                    <i v-if="!isLast" class="icon-bas" @click="emit('moveDownCard')"></i>
                    <i v-if="pos !== 1" class="icon-haut" @click="emit('moveUpCard')"></i>
                    <hr class="vertical-separator">
                    <i class="icon-glisser"></i>
                </div>
            </div>
            
            <div v-if="card.type !== 'component'" class="card-content">
                <GenericInput
                    v-for="(input, index) in card.inputs"
                    :key="index"
                    :type="input.type"
                    :inside-card="true"
                    :label="input.label"
                    :placeholder="input.placeholder"
                    :input-value="input.value"
                    :pos="pos"
                    @input="input.value = $event"
                />
            </div>
        </div>
    </Transition>
</template>

<style scoped lang="scss">
.form-icon {
    margin: .7rem .7rem .7rem 0;
}
.card {
    border: 2px solid var(--border);
    width: 25rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    transition: all .2s linear;
    &-header {
        padding: 0 .7rem;
        display: flex;
        flex-direction: row;
        cursor: move;
        &.border-bottom {
            border-bottom: 2px solid var(--border);
        }
        &.fixed {
            opacity: .7;
            pointer-events: none;
        }
        
        h3 {
            font-weight: bold;
            font-size: 1rem;
            margin: .7rem 0;
            flex-grow: 1;
            margin: auto;
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

                &.delete:hover {
                    color: var(--editor-red);
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