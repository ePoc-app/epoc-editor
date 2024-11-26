<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue';
import { getTinymce } from '@tinymce/tinymce-vue/lib/cjs/main/ts/TinyMCE';
import { Ref, ref, watch } from 'vue';
import { graphService } from '@/src/shared/services';
import { getCurrentState } from '@/src/shared/services/undoRedo.service';

const props = defineProps<{
    type: 'html' | 'html-text' | 'html-inline';
    id: string;
    label: string;
    inputValue: string;
    placeholder?: string;
    insideCard?: boolean;
}>();

const emit = defineEmits<{
    (e: 'input', value: string): void;
    (e: 'saveGivenState', state: string): void;
}>();

const editor = ref(null);
const content: Ref<string> = ref('');

function textChange() {
    emit('input', content.value);

    // Writing the project data at every input & letting the debounce handle the rest
    graphService.writeProjectData();
}

watch(
    () => props.inputValue,
    () => {
        content.value = props.inputValue;
    },
);

watch(
    () => content.value,
    () => {
        textChange();
    },
);

const template = `
    <details style="border: 1px solid lightgray; border-radius: 4px; padding: .5em .5em 0 .5em">
        <summary style="font-weight: bold; border-bottom: 1px solid lightgray; padding 1em;">Titre</summary>
        <div>content</div>
    </details>
    <p></p>
`;

const standardPlugins = 'image link lists template code table';
// noinspection SpellCheckingInspection
const standardToolbar =
    'link image bullist numlist outdent indent template code table | bold italic strikethrough alignleft aligncenter alignright ';
const textToolbar = 'bold italic link bullist numlist';
const textPlugins = 'link lists code';

const inlinePlugins = 'image link';
const inlineToolbar = 'link image bold italic strikethrough ';

const standardOptions = {
    menubar: false,
    min_height: 150,
    max_height: 800,
    height: 350,
    templates: [{ title: 'Plier/déplier', content: template, description: 'Plier/déplier avec titre et contenu' }],
    file_picker_types: 'image',
    file_picker_callback: handleFilePicker,
    link_default_target: '_blank',
    link_target_list: false,
    paste_data_images: true,
    paste_preprocess: (editor, args) => {
        args.content = args.content.replace(/font-family:[^;"]+;?/gi, '');
    },
};

const textOptions = {
    menubar: false,
    min_height: 150,
    max_height: 800,
    height: 350,
    link_target_list: false,
    paste_data_images: false,
};

const inlineOptions = {
    menubar: false,
    min_height: 150,
    max_height: 800,
    height: 200,
    file_picker_types: 'image',
    file_picker_callback: handleFilePicker,
    link_default_target: '_blank',
    link_target_list: false,
    paste_data_images: true,
    paste_preprocess: (editor, args) => {
        args.content = args.content.replace(/font-family:[^;"]+;?/gi, '');
    },
};

const typeMappings = {
    html: {
        toolbar: standardToolbar,
        plugins: standardPlugins,
        options: standardOptions,
    },
    'html-text': {
        toolbar: textToolbar,
        plugins: textPlugins,
        options: textOptions,
    },
    'html-inline': {
        toolbar: inlineToolbar,
        plugins: inlinePlugins,
        options: inlineOptions,
    },
};
const { toolbar, plugins, options } = typeMappings[props.type];

function init() {
    content.value = props.inputValue;
}

async function drop(event: DragEvent) {
    if (props.type === 'html-text') return;

    const file = event.dataTransfer.files[0];
    if (!file) return;
    const url = await graphService.importFile(file.path);
    const editor = getTinymce().activeEditor;
    editor.setContent(editor.getContent() + `<img alt="" src="${url}"/>`);
}

function handleFilePicker(callback: (url: string) => void) {
    if (props.type === 'html-text') return;

    const input = document.createElement('input');
    input.type = 'file';
    document.body.appendChild(input);
    input.click();
    input.addEventListener('change', async (e: Event) => {
        const fileInput = e.target as HTMLInputElement;
        const file = fileInput.files[0];
        if (!file) return;
        const url = await graphService.importFile(file.path);
        callback(url);
    });
}

// Undo Redo
let savedState = '';
let startValue = '';

function onFocus() {
    startValue = content.value;
    savedState = getCurrentState(true);

    const htmlInput = document.querySelector('.tox-tinymce') as HTMLElement;
    htmlInput.classList.add('focus');
}

function onBlur() {
    if (startValue !== content.value) emit('saveGivenState', savedState);

    const htmlInput = document.querySelector('.tox-tinymce') as HTMLElement;
    htmlInput.classList.remove('focus');
}

//? Didn't find a way to link the label to the editor because it uses a contenteditable p
function focusEditor() {
    const editor = getTinymce().activeEditor;
    editor.focus();
}

defineExpose({
    focusEditor,
});
</script>

<template>
    <Editor
        ref="editor"
        v-model="content"
        api-key="no-api-key"
        :plugins="plugins"
        :toolbar="toolbar"
        :init="options"
        @init="init"
        @drop.stop.prevent="drop"
        @focus="onFocus"
        @blur="onBlur"
    />
</template>
