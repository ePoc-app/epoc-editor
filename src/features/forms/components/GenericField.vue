<script setup lang="ts">
import { Input, NodeElement } from '@/src/shared/interfaces';
import GenericInput from './inputs/GenericInput.vue';
import { useEditorStore } from '@/src/shared/stores';
import { deleteElement, changeContentOrder } from '@/src/shared/services/graph';
import { getCurrentState, saveGivenState } from '@/src/shared/services/undoRedo.service';
import {
    RepeatAddEvent,
    RepeatChangeEvent,
    RepeatInputEvent,
    RepeatMoveEvent,
    RepeatRemoveEvent,
} from '@/src/shared/interfaces/form/repeatInput.interface';

const editorStore = useEditorStore();

defineProps<{
    inputs: Input[];
    fieldName?: string;
    fieldIndex?: number;
    displayFieldIndex?: boolean;
}>();

const currentNode = editorStore.getCurrentGraphNode;

const getInputValue = (input: Input) => {
    if (editorStore.openedBadgeId) return getBadgeInputValue(input);
    const formValues = editorStore.openedNodeId
        ? currentNode.data.elements.find((e: NodeElement) => e.id === editorStore.openedElementId)?.formValues ?? {}
        : currentNode.data.formValues;

    return formValues[input.id] ?? input.value;
};

const getBadgeInputValue = (input: Input) => {
    const epocNode = editorStore.getEpocNode;
    return epocNode.data.formValues['badges']?.[editorStore.openedBadgeId]?.[input.id] ?? input.value;
};

function onInput(value: string, id: string) {
    if (editorStore.openedBadgeId) return onBadgeInput(value, id);

    const element = editorStore.openedNodeId
        ? currentNode.data.elements.find((e: NodeElement) => e.id === editorStore.openedElementId)
        : currentNode.data;

    element.formValues[id] = value;
}

function onBadgeInput(value: string, id: string) {
    const epocNode = editorStore.getEpocNode;
    const badgeId = editorStore.openedBadgeId;

    epocNode.data.formValues['badges'][badgeId][id] = value;
}

//Repeat Input

function onRepeatInput(value: RepeatInputEvent, id: string) {
    const state = getCurrentState(true);

    const element = editorStore.openedNodeId
        ? currentNode.data.elements.find((e: NodeElement) => e.id === editorStore.openedElementId)
        : null;

    switch (value.type) {
        case 'add': {
            handleAddRepeatInput(element, value as RepeatAddEvent, id);
            break;
        }

        case 'remove': {
            handleRemoveRepeatInput(element, value as RepeatRemoveEvent, id);
            break;
        }

        case 'move': {
            handleMoveRepeatInput(element, value as RepeatMoveEvent, id);
            break;
        }

        case 'change': {
            handleChangeRepeatInput(element, value as RepeatChangeEvent, id);
            break;
        }

        default:
            break;
    }

    onSaveGivenState(state);
}

function handleAddRepeatInput(element: NodeElement | null, value: RepeatAddEvent, id: string): void {
    const formValues = element ? element.formValues : currentNode.data.formValues;
    if (!formValues[id]) formValues[id] = [];
    formValues[id].push(value.defaultValues);
}

function handleRemoveRepeatInput(element: NodeElement | null, value: RepeatRemoveEvent, id: string): void {
    const formValues = element ? element.formValues[id] : currentNode.data.formValues[id];
    formValues.splice(value.index, 1);

    const currentElement = currentNode.data.elements?.[value.index];
    if (!editorStore.openedNodeId && currentElement) {
        deleteElement(currentElement.id, currentElement.parentId);
    }
}

function handleMoveRepeatInput(element: NodeElement | null, value: RepeatMoveEvent, id: string): void {
    if (currentNode.data.elements && !editorStore.openedNodeId) {
        changeContentOrder(value.oldIndex, value.newIndex, currentNode.id);
    } else {
        const items = element ? element.formValues[id] : currentNode.data.formValues[id];
        const item = items.splice(value.oldIndex, 1);
        items.splice(value.newIndex, 0, item[0]);
    }
}

function handleChangeRepeatInput(element: NodeElement | null, value: RepeatChangeEvent, id: string): void {
    const formValues = element ? element.formValues : currentNode.data.formValues;

    if (value.id === '') {
        formValues[id][value.index] = value.value;
    } else {
        if (!formValues[id]) formValues[id] = {};
        if (!formValues[id][value.index]) formValues[id][value.id] = {};

        formValues[id][value.index][value.id] = value.value;
    }
}

// Repeat Input end

function onCheck(value: boolean, id: string) {
    const element = editorStore.openedNodeId
        ? currentNode.data.elements.find((e: NodeElement) => e.id === editorStore.openedElementId)
        : currentNode.data;

    element.formValues[id] = value;
}

function onSaveGivenState(state: string) {
    saveGivenState(state);
}
</script>

<template>
    <h3 v-if="fieldName" class="field-title">
        <span v-if="displayFieldIndex" class="field-index">{{ fieldIndex + 1 }}. </span>{{ fieldName }}
    </h3>
    <hr v-if="fieldName" class="separator" />
    <GenericInput
        v-for="(input, index) in inputs"
        :key="index"
        :input="input"
        :field-index="fieldIndex"
        :input-value="getInputValue(input)"
        @input="onInput($event, input.id)"
        @check="onCheck($event, input.id)"
        @repeat-input="onRepeatInput($event, input.id)"
        @save-given-state="onSaveGivenState"
    />
</template>

<style scoped lang="scss"></style>
