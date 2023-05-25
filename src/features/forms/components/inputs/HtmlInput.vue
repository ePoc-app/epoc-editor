<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue';
import { Ref, ref, watch } from 'vue';

const props = defineProps<{
    label: string;
    inputValue: string;
    placeholder?: string;
    insideCard?: boolean;
}>();

const emit = defineEmits<{
    (e: 'input', value: string): void;
}>();

const editor = ref(null);
const content: Ref<string> = ref('');

function textChange() {
    console.log('textChange');
    emit('input', content.value);
}

watch(
    () => props.inputValue,
    () => {
        content.value = props.inputValue;
    }
);

watch(
    () => content.value,
    () => {
        textChange();
    }
);

const plugins = 'bold italic underline lists align link image searchreplace visualblocks preview wordcount code fullscreen media table template help textpattern';
const toolbar = 'undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | link image | help | template | code';

const template = `
    <details style="border: 1px solid lightgray; border-radius: 4px; padding: .5em .5em 0 .5em">
        <summary style="font-weight: bold; border-bottom: 1px solid lightgray; padding 1em;">Titre</summary>
        <div>content</div>    
    </details>
    <p></p>
`;

function init() {
    content.value = props.inputValue;
}

function drop(event) {
    console.log('drop', event);
}

</script>

<template>
    <label for="editor">{{ label }}</label>
    <Editor 
        ref="editor"
        v-model="content"
        api-key="no-api-key"
        :plugins="plugins"
        :toolbar="toolbar"
        :init="{
            menubar: 'file edit view insert custom',
            templates: [
                { title: 'title 1', content: template, description: 'this is a test template' }
            ],
            file_picker_callback:(callback, value, meta) => {
                console.log('file_picker_callback', callback, value, meta);
                drop(value);
            }
        }"
        @init="init"
        @drop="drop"
    />
</template>