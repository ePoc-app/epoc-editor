<script setup lang="ts">
import { Quill, QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import ImageUploader from 'quill-image-uploader/src/quill.imageUploader';
import { Ref, reactive, ref, watch } from 'vue';
import { graphService } from '@/src/shared/services';
//@ts-ignore
import htmlEditButton from 'quill-html-edit-button';
import './accordionBlots';

const props = defineProps<{
    label: string;
    inputValue: string;
    placeholder?: string;
    insideCard?: boolean;
}>();

const emit = defineEmits<{
    (e: 'input', value: string): void;
}>();

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

const accordionInput = reactive({
    title: 'Title',
    content: 'Content',
});
const accordionForm = ref(false);


function textChange() {
    emit('input', content.value);
}

function initQuill() {
    content.value = props.inputValue;
}

function addAccordion() {
    // const value = { title: accordionInput.title, content: accordionInput.content };
    const quill = qlEditor.value.getQuill();
    // quill.insertEmbed(0, 'accordion', value);
    // accordionForm.value = false;
    // accordionInput.title = 'Title';
    // accordionInput.content = 'Content';
    const range = quill.getSelection(true);
    // quill.insertText(range, ' ', 'accordion', true);
    quill.insertEmbed(range, 'accordion', value);
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
    <div id="toolbar">
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
        <button class="ql-accordion" @click="addAccordion"></button>
    </div>
    <QuillEditor
        id="ql-editor"
        ref="qlEditor"
        v-model:content="content"
        content-type="html"
        theme="snow"
        :class="{ 'ql-card': insideCard }"
        :modules="modules"
        toolbar="#toolbar"
        :placeholder="placeholder"
        @text-change="textChange"
        @ready="initQuill"
    />
    <div v-if="accordionForm" class="accordion-form">
        <label for="title">Titre</label>
        <input id="title" v-model="accordionInput.title" type="text">
        <label for="content">Contenu</label>
        <input id="content" v-model="accordionInput.content" type="text">
        <button @click="addAccordion">Valider</button>
    </div>
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
