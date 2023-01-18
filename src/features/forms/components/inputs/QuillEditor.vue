<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { onMounted } from 'vue';

const props = defineProps<{
    label: string;
    placeholder?: string;
    inputValue: string;
}>();

const emit = defineEmits<{
    (e: 'input', value: string): void;
}>();

const toolbar = [['bold', 'italic', 'underline'], [{ 'header': 1}, { 'header': 2 }], [{ 'list': 'ordered' }, { 'list': 'bullet' }]];

function textChange() {
    emit('input', document.querySelector('.ql-editor').innerHTML);
}

onMounted(() => {
    document.querySelector('.ql-editor').innerHTML = props.inputValue;
});

</script>

<template>
    <QuillEditor
        :toolbar="toolbar"
        theme="snow"
        :placeholder="placeholder"
        @text-change="textChange"
    />
</template>

<style lang="scss">

.ql {
    &-toolbar {
        border: none !important;
        &:hover {
            border-radius: 8px;
        }
    }
    &-container {
        border: 1px solid var(--border) !important;
        border-radius: 4px;
        background-color: var(--item-background);
        margin-bottom: 1.5rem;
        &:focus-within {
            border: 1px solid var(--editor-blue) !important;
            box-shadow: 0 1px 8px 0 var(--editor-blue-shadow);
        }
    }
    &-editor {
        min-height: 10rem;
        padding: .5rem;
        font-size: 1rem;
        color: var(--text);
        width: 24rem;
    }

    &-active {
        background-color: transparent !important;
        &:hover {
            background-color: #F3F4F6 !important;
        }
    }

    &-formats {
        button:hover {
            border-radius: 4px;
            background-color: #F3F4F6 !important;
        }
    }
}

.ql-active .ql-stroke {
    stroke: var(--editor-blue) !important;
}

.ql-active .ql-fill {
    fill: var(--editor-blue) !important;
}

.ql-active:hover {
    background-color: var(--) !important;
}

.ql-blank::before {
    color: var(--editor-grayblue) !important;
    font-style: normal !important;
    left: 0.5rem !important;
}

</style>