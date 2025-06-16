<script setup lang="ts">
import { useEditorStore } from '../../shared/stores';
import FormButton from './components/FormButton.vue';
import GenericField from './components/GenericField.vue';
import { Input, NodeElement } from '@/src/shared/interfaces';
import { addNewBadge, deleteBadge, editorService } from '@/src/shared/services';
import { createToaster } from '@meforma/vue-toaster';
import {
    confirmDelete,
    duplicatePage,
    duplicateContent,
    transformActivityToPage,
    isFormButtonDisabled,
} from '@/src/shared/services/graph';
import LinkedBadges from '@/src/features/badge/components/LinkedBadges.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const editorStore = useEditorStore();

const toaster = createToaster({
    duration: 1000,
    queue: true,
});

const currentNode = editorStore.getCurrentGraphNode;

function actionOnForm(action: string) {
    switch (action) {
        case 'delete':
            confirmDelete();
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
            if (editorStore.savePageModel(currentNode.data.elements.map((element: NodeElement) => element.action))) {
                toaster.success(t('toast.modelSaved'));
            } else toaster.error(t('toast.modelExists'));
            break;

        case 'simple-question':
            transformActivityToPage();
            break;

        case 'back-to-epoc':
            editorStore.openEpoc();
            break;

        case 'delete-badge':
            deleteBadge(editorStore.openedBadgeId);
            editorStore.openEpoc();
            break;

        case 'add-badge':
            addNewBadge();
            break;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function checkIfDisabled(disabledProp: any): boolean {
    if (typeof disabledProp === 'boolean') {
        return disabledProp;
    } else if (typeof disabledProp === 'function') {
        return isFormButtonDisabled(disabledProp);
    } else {
        return false;
    }
}
</script>

<template>
    <div v-if="editorStore.formPanel.form.buttons.length" class="buttons">
        <FormButton
            v-for="button in editorStore.formPanel.form.buttons"
            :key="button.label"
            :label="button.label"
            :icon="button.icon"
            :disabled="checkIfDisabled(button.disabled)"
            @click="actionOnForm(button.action)"
        />
    </div>
    <div v-for="(field, index) of editorStore.formPanel.form.fields" :key="index" class="field">
        <GenericField
            :inputs="field.inputs as Input[]"
            :field-name="field.name"
            :field-index="index"
            :display-field-index="editorStore.formPanel.form.displayFieldIndex"
        />
    </div>
    <LinkedBadges :element-id="editorStore.openedElementId" />
</template>

<style scoped lang="scss">
.buttons {
    margin-bottom: 2.5rem;
    display: flex;
    flex-wrap: wrap;
}
</style>
