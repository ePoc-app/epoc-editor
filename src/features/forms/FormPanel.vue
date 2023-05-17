<script setup lang="ts">
import { useEditorStore } from '../../shared/stores';
import FormButton from './components/FormButton.vue';
import GenericField from './components/GenericField.vue';
import { Input } from '@/src/shared/interfaces';
import { projectService, editorService } from '@/src/shared/services';
import { createToaster } from '@meforma/vue-toaster';
import { confirmDelete, duplicatePage, duplicateContent } from '@/src/shared/services/graph';

const editorStore = useEditorStore();

const toaster = createToaster({
    duration: 1000,
    queue: true
});

const currentNode = editorStore.getCurrentGraphNode;

function actionOnForm(action: string) {
    switch (action) {
    case 'delete':
        confirmDelete();
        projectService.writeProjectData();
        break;

    case 'duplicate-page':
        duplicatePage();
        break;

    case 'back-to-page':
        editorStore.openPage();
        break;
    
    case 'duplicate-element':
        duplicateContent();
        break;

    case 'launch-preview':
        editorService.runPreviewAtPage();
        break;

    case 'save-model':
        if(editorStore.savePageModel(currentNode.data.elements.map((element) => element.action))) toaster.success('Modèle sauvegardé 👌');
        else toaster.error('Le modèle existe déjà 🤔');
        break;
    }

}

</script>

<template>
    <div class="panel">
        <button class="btn btn-close" @click="editorStore.closeFormPanel"><i class="icon-x"></i></button>
        <div class="title">
            <div class="form-icon"><i :class="editorStore.formPanel.icon"></i></div>
            <h1>{{ editorStore.formPanel.name }}</h1>
        </div>
        <div class="buttons">
            <FormButton
                v-for="button in editorStore.formPanel.buttons"
                :key="button.label"
                :label="button.label"
                :icon="button.icon"
                @click="actionOnForm(button.action)"
            />
        </div>
        <div
            v-for="(field, index) of editorStore.formPanel.fields"
            :key="index"
            class="field"
        >
            <GenericField 
                :inputs="(field.inputs as Input[])"
                :field-name="field.name"
                :field-index="index"
                :display-field-index="editorStore.formPanel.displayFieldIndex"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
.panel {
    position: absolute;
    top: 80px;
    right: 0;
    height: calc(100% - 80px);
    width: 26rem;
    background-color: white;
    padding: 0 1rem;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}
.title {
    display: flex;
    flex-direction: row;
    margin-top: 2.5rem;
    margin-bottom: 2rem;
    h1 {
        margin: 0;
        margin-left: 1rem;
    }
    .form-icon {
        transform: translate(0, 0.2rem);
    }
}

.buttons {
    margin-bottom: 2.5rem;
    display: flex;
    flex-wrap: wrap;
    max-width: 24rem;
}
</style>