<script setup lang="ts">
import { Input } from '@/src/shared/interfaces';
import GenericInput from './inputs/GenericInput.vue';
import { useEditorStore } from '@/src/shared/stores';
import { useVueFlow } from '@vue-flow/core';
import { projectService } from '@/src/shared/services';

defineProps<{
    inputs: Input[];
    fieldName?: string;
    fieldIndex?: number;
    displayFieldIndex: boolean;
}>();

const { findNode } = useVueFlow({ id:'main' });

const editorStore = useEditorStore();

const node = editorStore.openedParentId ? findNode(editorStore.openedParentId) : findNode(editorStore.openedNodeId);

function onInput(value, id) {
    if(editorStore.openedParentId) {
        const element = node.data.elements.find(element => element.id === editorStore.openedNodeId);
        element.formValues[id] = value;        
    } else {
        node.data.formValues[id] = value;
    }

    projectService.writeProjectData();
}

function onRepeatInput(value, id) {
    let element = null;
    if(editorStore.openedParentId) {
        element = node.data.elements.find(element => element.id === editorStore.openedNodeId);
    }

    if(value.type === 'add') {
        if(element) {
            if(!element.formValues[id]) element.formValues[id] = [];

            element.formValues[id].push(value.defaultValues);
        } else {
            if(!node.data.formValues[id]) node.data.formValues[id] = [];

            node.data.formValues[id].push(value.defaultValues);
        }
    } else if(value.type === 'remove') {
        element ? element.formValues[id].splice(value.index, 1) : node.data.formValues[id].splice(value.index, 1);

        if (node.data.elements && node.data.elements[value.index] && !editorStore.openedParentId) {
            const nodeToDelete = node.data.elements[value.index];
            editorStore.deleteElement( nodeToDelete.id, nodeToDelete.parentId);
        }
    } else if(value.type === 'move') {
        if (node.data.elements && !editorStore.openedParentId) {
            editorStore.changeElementOrder(value.oldIndex, value.newIndex, node.id);
        } else {
            if(element) {
                const item = element.formValues[id].splice(value.oldIndex, 1);
                element.formValues[id].splice(value.newIndex, 0, item[0]);
            } else {
                const item = node.data.formValues[id].splice(value.oldIndex, 1);
                node.data.formValues[id].splice(value.newIndex, 0, item[0]);
            }
        }
    } else if(value.type === 'change') {
        if(value.id === '') {
            element ? element.formValues[id][value.index] = value.value : node.data.formValues[id][value.index] = value.value;
        } else {
            if(element) {
                if(!element.formValues[id]) element.formValues[id] = {};
                if(!element.formValues[id][value.index]) element.formValues[id][value.index] = {};
                
                element.formValues[id][value.index][value.id] = value.value; 
            } else {
                if(!node.data.formValues[id][value.index]) node.data.formValues[id][value.index] = {};
    
                node.data.formValues[id][value.index][value.id] = value.value;
            }
        }
    }
    projectService.writeProjectData();
}

function getInputValue(input) {
    if(editorStore.openedParentId) {
        const element = node.data.elements.find(element => element.id === editorStore.openedNodeId);

        if(!element.formValues) element.formValues = {};

        return element.formValues[input.id] ? element.formValues[input.id] : input.value;
    } else {
        return node.data.formValues[input.id] ? node.data.formValues[input.id] : input.value;
    }
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