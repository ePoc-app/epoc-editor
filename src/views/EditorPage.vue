<script setup lang="ts">
import TopBar from '@/src/features/topBar/TopBar.vue';
import ePocFlow from '@/src/features/ePocFlow/ePocFlow.vue';
import SideBar from '@/src/features/sideBar/SideBar.vue';
import FormPanel from '@/src/features/forms/FormPanel.vue';
import ValidationModal from '../components/ValidationModal.vue';
import ConditionModal  from '@/src/features/badge/components/ConditionModal.vue';
import IconModal from '@/src/features/badge/components/IconModal.vue';
import { useEditorStore } from '@/src/shared/stores';
import { editorService, exitSelectNodeMode } from '@/src/shared/services';
import { confirmDelete, graphPaste } from '@/src/shared/services/graph';
import { saveState, setupUndo } from '../shared/services/undoRedo.service';
import { setupContextMenu } from '../shared/services/contextMenu.service';
import { computed } from 'vue';

const editorStore = useEditorStore();

editorService.setup();

function addDeleteEvent(event: KeyboardEvent) {
    const { key, metaKey, ctrlKey } = event;

    if ((key === 'Backspace' || key === 'Delete')) {
        if((event.target as HTMLElement).className.indexOf('vue-flow') !== -1 || event.target === document.body) {
            event.stopPropagation();
            confirmDelete();
        }
    }
   
    if(metaKey || ctrlKey) {
        if(key === 'v') {
            event.preventDefault();
            saveState();
            graphPaste(); 
        }
    }
}

function addEscapeEvent(event: KeyboardEvent) {
    const { key } = event;

    if(key === 'Escape' && editorStore.selectNodeMode) {
        event.stopPropagation();
        exitSelectNodeMode();
    }
}

document.body.removeEventListener('keydown', addDeleteEvent);
document.body.addEventListener('keydown', addDeleteEvent);

document.body.removeEventListener('keydown', addEscapeEvent);
document.body.addEventListener('keydown', addEscapeEvent);

function addMouseUpEvent() {
    document.body.classList.remove('cursor-not-allowed', 'cursor-allowed');
}

document.body.removeEventListener('mouseup', addMouseUpEvent);
document.body.addEventListener('mouseup', addMouseUpEvent);

setupUndo();
setupContextMenu();

function onCursorNotAllowed() {
    document.body.classList.remove('cursor-allowed');
    document.body.classList.add('cursor-not-allowed');
}

function onCursorAllowed() {
    document.body.classList.remove('cursor-not-allowed');
    document.body.classList.add('cursor-allowed');
}

function onRemoveCursor() {
    document.body.classList.remove('cursor-not-allowed', 'cursor-allowed');
}

const editorDisplay = computed(() => editorStore.selectNodeMode ? 'editor-flex' : 'editor-grid');

</script>

<template>
    <div
        :class="editorDisplay"
        class="editor-container"
        @drop="onRemoveCursor"
        @dragend="onRemoveCursor"
        @mouseup="editorStore.dismissModals"
        @click="editorStore.dismissModals"
    >
        <SideBar v-if="!editorStore.selectNodeMode" class="side-bar" @dragover="onCursorNotAllowed" />
        <TopBar v-if="!editorStore.selectNodeMode" class="top-bar" @dragover="onCursorNotAllowed" />
        <div v-if="editorStore.selectNodeMode" class="flex-information">
            <h4>Cliquer sur l'élément de contenu concerné par la condition pour la sélectionner</h4>
            <button class="btn btn-top-bar" @click="exitSelectNodeMode()">
                Annuler
            </button>
        </div>
        <ePocFlow class="editor-content" @dragover="onCursorAllowed" />
        <Transition>
            <FormPanel v-if="editorStore.formPanel && !editorStore.selectNodeMode" class="formPanel" @dragover="onCursorNotAllowed" />
        </Transition>
        <ValidationModal v-if="editorStore.validationModal" />
        <ConditionModal v-if="editorStore.conditionModal && !editorStore.selectNodeMode" />
        <IconModal v-if="editorStore.iconModal" />
    </div>
</template>

<style scoped lang="scss">
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.editor-grid {
    display: grid;
    height: 100%;
    // grid-template-columns: 265px auto;
    grid-template-columns: 100px auto;
    grid-template-rows: 80px auto;

    .side-bar {
        grid-column: 1;
        grid-row: 1 / 3;
    }

    .top-bar {
        grid-column: 2;
        grid-row: 1;
    }

    .editor-content {
        grid-column: 2;
        margin: auto;
    }

}

.editor-flex{
    display: flex;
    flex-direction: column;
    height: 100%;

    .editor-content {
        margin: auto;
    }

    .flex-information {
        h4 {
            text-align: center;
            flex-grow: 1;
        }
        button {
            margin: auto 2rem auto 0;
            font-size: 1rem;
        }
        display: flex;
        width: 100%;
        text-align: center;
        background: var(--node);
        user-select: none;
        border-bottom: 2px solid var(--border);
    }
}
</style>