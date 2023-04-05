<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
//@ts-ignore
import ImageUploader from 'quill-image-uploader';
import { Ref, ref, watch } from 'vue';
import { projectService } from '@/src/shared/services';

const props = defineProps<{
    label: string;
    inputValue: string;
    placeholder?: string;
    insideCard?: boolean;
}>();

const emit = defineEmits<{
    (e: 'input', value: string): void;
}>();

const toolbar = [
    ['bold', 'italic', 'underline', { 'list': 'ordered' }, { 'list': 'bullet' }, { 'align': null}, {'align': 'center'}, {'align': 'right'}, 'link', 'image']
];

const modules = {
    name: 'imageUploader',
    module: ImageUploader,
    options: {
        upload: (file) => {
            return projectService.importFile(file.path);
        }
    }
};

function textChange() {
    emit('input', content.value);
}

function initQuill() {
    content.value = props.inputValue;
}

const qlEditor = ref(null);

const content: Ref<string> = ref(null);

watch(
    () => props.inputValue,
    () => {
        content.value = props.inputValue;
    }
);

</script>

<template>
    <label for="ql-editor">{{ label }}</label>
    <QuillEditor
        id="ql-editor"
        ref="qlEditor"
        v-model:content="content"
        content-type="html"
        theme="snow"
        :class="{ 'ql-card': insideCard }"
        :modules="modules"
        :toolbar="toolbar"
        :placeholder="placeholder"
        @text-change="textChange"
        @ready="initQuill"
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

        p {
            margin-bottom: .5rem;
        }
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

    &-card {
        margin-bottom: 1rem;
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