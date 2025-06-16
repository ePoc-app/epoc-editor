<!--suppress TypeScriptCheckImport -->
<script setup lang="ts">
import { useEditorStore } from '../../shared/stores';
import FormButton from './components/FormButton.vue';
import GenericField from './components/GenericField.vue';
import { Input, NodeElement } from '@/src/shared/interfaces';
import { addNewBadge, closeFormPanel, deleteBadge, editorService } from '@/src/shared/services';
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

defineProps<{
    isMaximized: boolean;
}>();

const emit = defineEmits<{
    (e: 'maximize'): void;
    (e: 'minimize'): void;
}>();

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

function maximizeFormPanel() {
    emit('maximize');
}

function minimizeFormPanel() {
    emit('minimize');
}
</script>

<template>
    <div class="command-buttons">
        <button v-if="isMaximized" class="btn" @click="minimizeFormPanel"><i class="icon-minimize-2"></i></button>
        <button v-else class="btn" @click="maximizeFormPanel"><i class="icon-maximize-2"></i></button>
        <button class="btn" @click="closeFormPanel"><i class="icon-x"></i></button>
    </div>
    <div class="title">
        <div class="form-icon"><i :class="editorStore.formPanel.form.icon"></i></div>
        <h1>{{ editorStore.formPanel.form.name }}</h1>
    </div>
    <div class="buttons">
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
.title {
    display: flex;
    flex-direction: row;
    margin-top: 2.5rem;
    margin-bottom: 2rem;
    h1 {
        margin: 0 0 0 1rem;
    }
    .form-icon {
        transform: translate(0, 0.2rem);
    }
}

.command-buttons {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    gap: 1rem;
    padding: 1rem;

    button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.5rem;
        height: 1.5rem;
        z-index: 10;
        border-radius: 2rem;
        i {
            margin: 0;
            font-size: 14px;
            font-weight: 800;
            color: var(--text);
        }
    }
}

.buttons {
    margin-bottom: 2.5rem;
    display: flex;
    flex-wrap: wrap;
}
</style>
