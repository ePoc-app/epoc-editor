<script setup lang="ts">
import { getCurrentState } from '@/src/shared/services/undoRedo.service';
import { useEditorStore } from '@/src/shared/stores';

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

function onChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const state = getCurrentState(true);

    emit('change', value);
    emit('saveGivenState', state);
}
</script>

<template>
    <div class="select">
        <select :id="id" :value="inputValue" class="select-box" @change="onChange">
            <option value="">{{ $t('global.pleaseSelect') }}</option>
            <option v-for="(option, index) in getOptions()" :key="index" :value="option">{{ option }}</option>
        </select>
    </div>
</template>

<style scoped lang="scss">
.select {
    display: flex;
    flex-direction: column;
    margin: 1rem 0 0.5rem 0;
    label {
        margin-bottom: 0.5rem;
    }
    select {
        appearance: none;
        padding: 0.5rem;
        border: 1px solid var(--border);
        border-radius: 4px;
        background-color: var(--item-background);
        cursor: pointer;
        font-size: 1rem;
        color: var(--text);

        background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgd2lkdGg9IjExcHgiIGhlaWdodD0iN3B4IiB2aWV3Qm94PSIwIDAgMTEuMCA3LjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxjbGlwUGF0aCBpZD0iaTAiPjxwYXRoIGQ9Ik0yNDE4LDAgTDI0MTgsMjQyNiBMMCwyNDI2IEwwLDAgTDI0MTgsMCBaIj48L3BhdGg+PC9jbGlwUGF0aD48Y2xpcFBhdGggaWQ9ImkxIj48cGF0aCBkPSJNOS4yMDE3MjIyNywwIEM5LjYxNjUwNDA2LDAgOS45OTA4OTcyMSwwLjI3MzU1MDk4NyAxMC4xNDk4ODU5LDAuNjk0MzM1OTM3IEMxMC4zMDg4NzQ2LDEuMTE1MTIwODkgMTAuMjQ5ODk0OSwxLjU5OTYwOTM3IDkuOTU0OTk2NjMsMS45MTk1MzE0NiBMNS44ODA5MDQ1NSw2LjQxOTUzMTQ2IEM1LjY1MzMxOTM0LDYuNjQxMDE1NDEgNS4zOTA0NzQ3Niw2Ljc1IDUuMTI3NjMwMTksNi43NSBDNC44NjQ3ODU2Miw2Ljc1IDQuNjAyNTgxNzgsNi42NDAxMzY3MiA0LjQwMjI0Mjg2LDYuNDIwNDEwMTYgTDAuMzI4MTUwMjkxLDEuOTIwNDEwMTYgQzAuMDA2MTQ2NTU1MTksMS41OTk2MDkzNyAtMC4wODE2OTQ5MjIzLDEuMTE0NDUzMDIgMC4wNzcxMDE1NTQ3LDAuNjk2MDkzODU3IEMwLjIzNTg5ODAzMiwwLjI3NzczNDY5NyAwLjYxMDIyNzEwNiwwIDEuMDI0Njg4NTMsMCBMOS4yMDE3MjIyNywwIFoiPjwvcGF0aD48L2NsaXBQYXRoPjwvZGVmcz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTMwNC4wIC0xMDYyLjApIj48ZyBjbGlwLXBhdGg9InVybCgjaTApIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5ODAuMCA5MC4wKSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAuMCA3MjkuMCkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMCA1MS4wKSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUuMCAxNTAuMCkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMCAyNC4wKSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjg5LjM3MjM2OTgwNjgwMSAxOC4wKSI+PGcgY2xpcC1wYXRoPSJ1cmwoI2kxKSI+PHBvbHlnb24gcG9pbnRzPSItMS4xMTAyMjMwMmUtMTYsMCAxMC4yMzYwMTA0LDAgMTAuMjM2MDEwNCw2Ljc1IC0xLjExMDIyMzAyZS0xNiw2Ljc1IC0xLjExMDIyMzAyZS0xNiwwIiBzdHJva2U9Im5vbmUiIGZpbGw9IiMzNTQyNTgiPjwvcG9seWdvbj48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L3N2Zz4=');
        background-repeat: no-repeat;
        background-position: right 0.7rem top 50%;
        background-size: 0.8rem auto;
    }
}
</style>
