<script setup lang='ts'>
import { useEditorStore } from '@/src/shared/stores';
import GenericInput from './GenericInput.vue';
import AddCard from './card/AddCard.vue';
import { Input } from '@/src/shared/interfaces';
import { ref } from 'vue';
import { useVueFlow } from '@vue-flow/core';


const props = defineProps<{
    inputs: Input[];
    label: string;
    inputValues: string[];
    fieldIndex: number;
    addButton: boolean;
}>();

const emit = defineEmits<{
    (e: 'change', value: object | string): void;
}>();

const { findNode } = useVueFlow({ id: 'main' });
const editorStore = useEditorStore();

const node = editorStore.openedParentId ? findNode(editorStore.openedParentId) : findNode(editorStore.openedNodeId);


function onInput(value, id, index) {
    emit('change', {
        type: 'change',
        value,
        id,
        index
    });
}

function addCard() {
    emit('change', {
        type: 'add',
    });
}

function removeCard(index) {
    emit('change', {
        type: 'remove',
        index
    });
}

function moveCard(oldIndex, newIndex) {
    emit('change', {
        type: 'move',
        oldIndex,
        newIndex
    });
}

function onCheck(value, id, index) {
    emit('change', {
        type: 'change',
        value,
        id,
        index
    });
}

function isLast(index) {
    return props.inputValues.length - 1 === index;
}

const dragOptions = {
    animation: 200,
    group: 'cards',
    disabled: false,
    ghostClass: 'ghost',
};

const drag = ref(false);

</script>

<template>
    <VueDraggable
        key="draggable"
        :model-value="inputValues"
        item-key="index"
        handle=".card-header"
        v-bind="dragOptions"
        filter=".fixed"
        @change="moveCard($event.moved.oldIndex, $event.moved.newIndex)"
        @start="drag = true"
        @end="drag = false"
    >
        <template #item="{ element, index }">
            <div :key="index" class="card draggable-card">
                <div class="card-header" :class="{ 'border-bottom': inputs.length >= 1, 'fixed': node.data.type === 'template' }">
                    <div v-if="element.action" class="component-container">
                        <div class="form-icon"><i :class="element.action.icon"></i></div>
                        <h3>{{ element.action.label }}</h3>
                    </div>
                    <h3 v-else>{{ label }} {{ index + 1 }}</h3>
                    <div class="card-header-icon">
                        <i class="icon-supprimer delete" @click="removeCard(index)"></i>
                        <hr v-if="!(isLast(index) && index === 0)" class="vertical-separator">
                        <i v-if="!isLast(index)" class="icon-bas" @click="moveCard(index, index + 1)"></i>
                        <i v-if="index !== 0" class="icon-haut" @click="moveCard(index, index - 1)"></i>
                        <hr class="vertical-separator">
                        <i class="icon-glisser"></i>
                    </div>
                </div>
                <div v-if="!element.action" class="card-content">
                    <GenericInput 
                        v-for="(input, indexKey) in inputs"
                        :key="indexKey"
                        :input="input"
                        :field-index="fieldIndex"
                        :input-value="inputs.length > 1 ? element[input.id] : element"
                        :inside-card="true"
                        :pos="index"
                        @input="onInput($event, input.id, index)"
                        @check="onCheck($event, input.id, index)"
                    />
                </div>
            </div>
        </template>
    </VueDraggable>
    <AddCard
        v-if="addButton !== false"
        placeholder="Ajouter"
        class="add-card"
        @click="addCard"
    />
</template>

<style lang="scss" scoped>
.form-icon {
    margin: .7rem .7rem .7rem 0;
}
.component-container {
    display: flex;
    flex-direction: row;
    flex-grow:1;
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