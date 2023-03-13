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
    node.data.formValues[id] = value;
    projectService.writeProjectData();
}

function onRepeatInput(value, id) {
    if(value.type === 'add') {
        if(!node.data.formValues[id]) {
            node.data.formValues[id] = [];
        }
        node.data.formValues[id].push('');
    } else if(value.type === 'remove') {
        node.data.formValues[id].splice(value.index, 1);
        if (node.data.elements && node.data.elements[value.index]) {
            const nodeToDelete = node.data.elements[value.index];
            editorStore.deleteElement( nodeToDelete.id, nodeToDelete.parentId);
        }
    } else if(value.type === 'move') {
        if (node.data.elements) {
            editorStore.changeElementOrder(value.oldIndex, value.newIndex, node.id);
        } else {
            const item = node.data.formValues[id].splice(value.oldIndex, 1);
            node.data.formValues[id].splice(value.newIndex, 0, item[0]);
        }
    } else if(value.type === 'change') {
        if(value.id === '') {
            node.data.formValues[id][value.index] = value.value;
        } else {
            if(!node.data.formValues[id][value.index]) {
                node.data.formValues[id][value.index] = {};
            }
            node.data.formValues[id][value.index][value.id] = value.value;
        }
    }
    projectService.writeProjectData();
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
        :input-value="node.data.formValues[input.id] ? node.data.formValues[input.id] : input.value"
        @input="onInput($event, input.id)"
        @repeat-input="onRepeatInput($event, input.id)"
    />
</template>

<style scoped lang="scss">
</style>