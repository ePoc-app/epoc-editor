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

    if(editorStore.openedParentId && node.data.type === 'question') {
        const contentId = node.data.elements.find(element => element.id === editorStore.openedNodeId).contentId;

        if(!node.data.formValues[contentId]) node.data.formValues[contentId] = {};

        node.data.formValues[contentId][id] = value;
    } else {
        node.data.formValues[id] = value;
    }
    projectService.writeProjectData();
}

function onRepeatInput(value, id) {

    let contentId = null;
    if(editorStore.openedParentId && node.data.type === 'question') {
        contentId = node.data.elements.find(element => element.id === editorStore.openedNodeId).contentId;
    }

    if(value.type === 'add') {
        if(contentId) {
            if(!node.data.formValues[contentId]) node.data.formValues[contentId] = {};
            if(!node.data.formValues[contentId][id]) node.data.formValues[contentId][id] = [];

            node.data.formValues[contentId][id].push('');
        } else {
            if(!node.data.formValues[id]) node.data.formValues[id] = [];

            node.data.formValues[id].push('');
        }
    } else if(value.type === 'remove') {
        contentId ? node.data.formValues[contentId][id].splice(value.index, 1) : node.data.formValues[id].splice(value.index, 1);

        if (node.data.elements && node.data.elements[value.index] && !editorStore.openedParentId) {
            const nodeToDelete = node.data.elements[value.index];
            editorStore.deleteElement( nodeToDelete.id, nodeToDelete.parentId);
        }
    } else if(value.type === 'move') {
        if (node.data.elements && !editorStore.openedParentId) {
            editorStore.changeElementOrder(value.oldIndex, value.newIndex, node.id);
        } else {
            if(contentId) {
                const item = node.data.formValues[contentId][id].splice(value.oldIndex, 1);
                node.data.formValues[contentId][id].splice(value.newIndex, 0, item[0]);
            } else {
                const item = node.data.formValues[id].splice(value.oldIndex, 1);
                node.data.formValues[id].splice(value.newIndex, 0, item[0]);
            }
        }
    } else if(value.type === 'change') {
        if(value.id === '') {
            contentId ? node.data.formValues[contentId][id][value.index] : node.data.formValues[id][value.index] = value.value;
        } else {
            if(contentId) {
                if(!node.data.formValues[contentId][id]) node.data.formValues[contentId][id] = {};
                if(!node.data.formValues[contentId][id][value.index]) node.data.formValues[contentId][id][value.index] = {};

                node.data.formValues[contentId][id][value.index][value.id] = value.value;
            } else {
                if(!node.data.formValues[id][value.index]) node.data.formValues[id][value.index] = {};
    
                node.data.formValues[id][value.index][value.id] = value.value;
            }
        }
    }
    projectService.writeProjectData();
}

function getInputValue(input) {
    if(editorStore.openedParentId && node.data.type === 'question') {
        const contentId = node.data.elements.find(element => element.id === editorStore.openedNodeId).contentId;
        if(!node.data.formValues[contentId]) {
            node.data.formValues[contentId] = {};
        }
        return node.data.formValues[contentId][input.id] ? node.data.formValues[contentId][input.id] : input.value;
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