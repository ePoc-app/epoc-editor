<script setup lang="ts">
import { FormRepeatChangeAction, FormRepeatMoveAction, FormUpdatedAction, Input } from '@/src/shared/interfaces';
import GenericInput from './inputs/GenericInput.vue';
import { useEditorStore, useUndoRedoStore } from '@/src/shared/stores';
import { graphService } from '@/src/shared/services';
import { deleteElement, changeContentOrder } from '@/src/shared/services/graph';

const editorStore = useEditorStore();
const undoRedoStore = useUndoRedoStore();

defineProps<{
    inputs: Input[];
    fieldName?: string;
    fieldIndex?: number;
    displayFieldIndex: boolean;
}>();

const currentNode = editorStore.getCurrentGraphNode;

const getInputValue = (input) => {
    const formValues = editorStore.openedNodeId
        ? (currentNode.data.elements.find(e => e.id === editorStore.openedElementId)?.formValues ?? {})
        : currentNode.data.formValues;
    
    return formValues[input.id] ?? input.value;
};


function onInput(value: string, id: string) {
    const element = editorStore.openedNodeId
        ? currentNode.data.elements.find(e => e.id === editorStore.openedElementId)
        : currentNode.data;
    
    element.formValues[id] = value;
    graphService.writeProjectData();
}


//Repeat Input

function onRepeatInput(value, id: string) {
    const element = editorStore.openedNodeId
        ? currentNode.data.elements.find(e => e.id === editorStore.openedElementId)
        : null;
    
    
    switch(value.type) {

    case 'add':
    {
        handleAddRepeatInput(element, value, id);
        break;
    }

    case 'remove':
    {
        handleRemoveRepeatInput(element, value, id);
        break;
    }

    case 'move':
    {
        handleMoveRepeatInput(element, value, id);
        break;
    }

    case 'change':
    {
        handleChangeRepeatInput(element, value, id);
        break;
    }
    
    default: break;
    }

    graphService.writeProjectData();
}

function handleAddRepeatInput(element, value, id: string): void {
    const formValues = element ? element.formValues : currentNode.data.formValues;
    if(!formValues[id]) formValues[id] = [];
    formValues[id].push(value.defaultValues);
}

function handleRemoveRepeatInput(element, value, id: string): void {
    const formValues = element ? element.formValues[id] : currentNode.data.formValues[id];
    formValues.splice(value.index, 1);
    
    const currentElement = currentNode.data.elements?.[value.index];
    if(!editorStore.openedNodeId && currentElement) {
        deleteElement(currentElement.id, currentElement.parentId);
    }
}

function handleMoveRepeatInput(element, value, id: string): void {
    
    onAddMoveUndoAction(id, value.oldIndex, value.newIndex);

    if(currentNode.data.elements && !editorStore.openedNodeId) {
        changeContentOrder(value.oldIndex, value.newIndex, currentNode.id);
    } else {
        const items = element ? element.formValues[id] : currentNode.data.formValues[id];
        const item = items.splice(value.oldIndex, 1);
        items.splice(value.newIndex, 0, item[0]);
    }
}

function handleChangeRepeatInput(element, value, id: string): void {
    const formValues = element ? element.formValues : currentNode.data.formValues;

    if(value.id === '') {
        formValues[id][value.index] = value.value;
    } else {
        if(!formValues[id]) formValues[id] = {};
        if(!formValues[id][value.index]) formValues[id][value.id] = {};

        formValues[id][value.index][value.id] = value.value;
    }
}

function onAddChangeUndoAction(repeatEvent, formValueId: string): void  {
    const { type, value, index, id } = repeatEvent;
    
    const action: FormRepeatChangeAction = {
        type: 'formRepeatUpdated',
        nodeId: currentNode.id,
        elementId: editorStore.openedElementId,
        formValueId,
        repeatId: id,
        updateType: type,
        oldValue: value.oldValue,
        newValue: value.newValue,
        index: index
    };
    
    undoRedoStore.addAction(action);  
}

function onAddMoveUndoAction(formValueId: string, oldIndex: number, newIndex: number): void {

    const action: FormRepeatMoveAction = {
        type: 'formRepeatUpdated',
        nodeId: currentNode.id,
        elementId: editorStore.openedElementId,
        formValueId,
        updateType: 'move',
        oldIndex,
        newIndex
    };
    
    undoRedoStore.addAction(action);
}
// Repeat Input end

function onCheck(value: boolean, id:string) {
    const element = editorStore.openedNodeId
        ? currentNode.data.elements.find(e => e.id === editorStore.openedElementId)
        : currentNode.data;
    
    element.formValues[id] = value;
    graphService.writeProjectData();
}

function onAddUndoAction(value: { oldValue: string, newValue: string }, id: string) {
    const { oldValue, newValue } = value;
    
    const action: FormUpdatedAction = {
        type: 'formUpdated',
        nodeId: currentNode.id,
        elementId: editorStore.openedElementId,
        oldValue,
        newValue,
        formValueId: id
    };
    undoRedoStore.addAction(action);
}

</script>

<template>
    <h3 v-if="fieldName" class="field-title"><span v-if="displayFieldIndex" class="field-index">{{ fieldIndex+1 }}. </span>{{ fieldName }}</h3>
    <hr v-if="fieldName" class="separator">
    <GenericInput 
        v-for="(input, index) in inputs"
        :key="index"
        :input="input"
        :field-index="fieldIndex"
        :input-value="getInputValue(input)"
        @input="onInput($event, input.id)"
        @check="onCheck($event, input.id)"
        @repeat-input="onRepeatInput($event, input.id)"
        @add-undo-action="onAddUndoAction($event, input.id)"
        @add-repeat-undo-action="onAddChangeUndoAction($event, input.id)"
    />
</template>

<style scoped lang="scss">
</style>