<script setup lang="ts">
import UiSelect from '@/src/components/ui/UiSelect.vue';
import { getCurrentState } from '@/src/shared/services/undoRedo.service';
import { useEditorStore } from '@/src/shared/stores';
import { ref, watch, computed } from 'vue';

const editorStore = useEditorStore();

const props = defineProps<{
    id: string;
    label: string;
    inputValue: string;
    placeholder: string;
    options: string[];
    linkedOptions: string;
}>();

const emit = defineEmits<{
    (e: 'change', value: string): void;
    (e: 'saveGivenState', state: string): void;
}>();

const currentNode = editorStore.getCurrentGraphNode;
const currentContent = currentNode.data.elements.find(({ id }) => id === editorStore.openedElementId);

function getOptions() {
    if (!props.linkedOptions) return props.options;

    // In this case we have to change the epoc formValues
    //? refactor this if another case is needed
    if (props.id === 'template') {
        const epocNode = editorStore.getEpocNode;

        return walkObjectPath(epocNode.data.formValues, props.linkedOptions);
    } else {
        return currentContent.formValues[props.linkedOptions];
    }
}

function walkObjectPath(object: any, path: string) {
    const currentKey = path.split('.')[0];

    if (!currentKey) {
        return object;
    }

    if (currentKey === '*') {
        if (!object) return [];

        return object.map((item: any) => walkObjectPath(item, path.slice(2)));
    } else {
        return walkObjectPath(object[currentKey], path.slice(currentKey.length + 1));
    }
}

const input = ref(props.inputValue);
watch(input, (newValue) => {
    const state = getCurrentState(true);
    emit('change', newValue);
    emit('saveGivenState', state);
});

const items = computed(() => [...getOptions().map((item: string) => ({ value: item, label: item }))]);
</script>

<template>
    <UiSelect :id="id" v-model="input" :options="items" />
</template>
