<script setup lang="ts">
import { QuillEditor, Quill } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import ImageUploader from 'quill-image-uploader/src/quill.imageUploader';
import { Ref, ref, watch } from 'vue';
import { graphService } from '@/src/shared/services';
//@ts-ignore
import htmlEditButton from 'quill-html-edit-button';


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
    [
        'bold',
        'italic',
        'underline',
        { 'list': 'ordered' },
        { 'list': 'bullet' },
        { 'align': null},
        {'align': 'center'},
        {'align': 'right'}, 
        'link',
        'image'
    ]
];

const image = Quill.import('formats/image');

image.sanitize = function(url) {
    return url;
};

const modules = [
    {
        name: 'imageUploader',
        module: ImageUploader,
        options: {
            upload: (file) => graphService.importFile(file.path)
        }, 
    },
    {
        name: 'htmlEditButton',
        module: htmlEditButton,
        option: {
            debug: true,
        }
    }
];

const qlEditor = ref(null);

const content: Ref<string> = ref('');
    



const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    [{ details: 'details' }], // add the details button
];

const quillOptions = {
    theme: 'snow',
    sanitize: false
};

function insertDetails() {
    const quill = qlEditor.value.getQuill();
    const detailsTag = '<details><summary>Details</summary>Content goes here</details>';
    console.log(quill);
    quill.clipboard.dangerouslyPasteHTML(detailsTag);
    // const quill = qlEditor.value.getQuill();
    // const range = quill.getSelection(true);
    // const content = quill.getSelection().toString() || 'Details';
    // quill.insertEmbed(range.index, 'details', content);
    // quill.setSelection(range.index + 1, Quill.sources.USER);
}

function textChange() {
    emit('input', content.value);
}

function initQuill() {
    content.value = props.inputValue;
}

watch(
    () => props.inputValue,
    () => {
        content.value = props.inputValue;
    }
);

</script>

<template>
    <label for="ql-editor">{{ label }}</label>
    <div id="my-toolbar">
        <button class="ql-bold"></button>
        <button class="ql-italic"></button>
        <button class="ql-underline"></button>
        <button class="ql-list" value="ordered"></button>
        <button class="ql-list" value="bullet"></button>
        <button class="ql-align"></button>
        <button class="ql-align" value="center"></button>
        <button class="ql-align" value="right"></button>
        <button class="ql-link"></button>
        <button class="ql-image"></button>
        <button class="ql-accordion" @click="insertDetails">C</button>
    </div>
    <QuillEditor
        id="ql-editor"
        ref="qlEditor"
        v-model:content="content"
        content-type="html"
        :toolbar="toolbarOptions"
        :class="{ 'ql-card': insideCard }"
        :modules="modules"
        :options="quillOptions"
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

// Quill Edit button

.ql-html {
    &-textContainer {
        background: white;
    }
    
    &-textArea {
        border: 1px solid var(--border);
    }

    &-buttonOk, &-buttonCancel {
        border: none;
        cursor: pointer;
        color: var(--text);
        border-radius: 6px;
        transition: box-shadow .2s ease-in-out;
        padding: .5rem 1rem;
        
        &:hover {
            box-shadow: 0 1px 8px 0 var(--shadow-outer);
        }
    }
}
</style>
