<script setup lang="ts">
import { Input } from '@/src/shared/interfaces';
import GenericInput from './inputs/GenericInput.vue';
import { useEditorStore } from '@/src/shared/stores';
import { graphService } from '@/src/shared/services';
import { deleteElement, changeContentOrder } from '@/src/shared/services/graph';

const editorStore = useEditorStore();

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

function onRepeatInput(value, id: string) {
    const element = editorStore.openedNodeId
        ? currentNode.data.elements.find(e => e.id === editorStore.openedElementId)
        : null;
    
    
    switch(value.type) {

    case 'add':
    {
        const formValues = element ? element.formValues : currentNode.data.formValues;
        if(!formValues[id]) formValues[id] = [];
        formValues[id].push(value.defaultValues);

        break;
    }

    case 'remove':
    {
        const formValues = element ? element.formValues[id] : currentNode.data.formValues[id];
        formValues.splice(value.index, 1);

        const currentElement = currentNode.data.elements?.[value.index];
        if(!editorStore.openedNodeId && currentElement) {
            deleteElement(currentElement.id, currentElement.parentId);
        }

        break;
    }

    case 'move':
        if(currentNode.data.elements && !editorStore.openedNodeId) {
            changeContentOrder(value.oldIndex, value.newIndex, currentNode.id);
        } else {
            const items = element ? element.formValues[id] : currentNode.data.formValues[id];
            const item = items.splice(value.oldIndex, 1);
            items.splice(value.newIndex, 0, item[0]);
        }

        break;
    
    case 'change':
    {
        const formValues = element ? element.formValues : currentNode.data.formValues;
        if(value.id === '') {
            formValues[id][value.index] = value.value;
        } else {
            if(!formValues[id]) formValues[id] = {};
            if(!formValues[id][value.index]) formValues[id][value.id] = {};

            formValues[id][value.index][value.id] = value.value;
        }

        break;
    }
    
    default: break;
    }

    graphService.writeProjectData();

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
        @repeat-input="onRepeatInput($event, input.id)"
    />
</template>

<style scoped lang="scss">
</style>