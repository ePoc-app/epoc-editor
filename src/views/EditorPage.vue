<script setup lang="ts">
import TopBar from '@/src/features/topBar/TopBar.vue';
import ePocFlow from '@/src/features/ePocFlow/ePocFlow.vue';
import SideBar from '@/src/features/sideBar/SideBar.vue';
import FormPanel from '@/src/features/forms/FormPanel.vue';
import ValidationModal from '../components/ValidationModal.vue';
import { useEditorStore } from '@/src/shared/stores';
import { editorService } from '@/src/shared/services';
import { confirmDelete, graphPaste } from '@/src/shared/services/graph';
import { saveState, setupUndo } from '../shared/services/undoRedo.service';

const editorStore = useEditorStore();

editorService.setup();

function addDeleteEvent(event) {
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

document.body.removeEventListener('keydown', addDeleteEvent);
document.body.addEventListener('keydown', addDeleteEvent);

function addMouseUpEvent() {
    document.body.classList.remove('cursor-not-allowed', 'cursor-allowed');
}

document.body.removeEventListener('mouseup', addMouseUpEvent);
document.body.addEventListener('mouseup', addMouseUpEvent);

setupUndo();

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

</script>

<template>
    <div class="editor-container" @drop="onRemoveCursor" @dragend="onRemoveCursor" @mouseup="editorStore.dismissModals" @click="editorStore.dismissModals">
        <SideBar class="side-bar" @dragover="onCursorNotAllowed" />
        <TopBar class="top-bar" @dragover="onCursorNotAllowed" />
        <ePocFlow class="editor-content" @dragover="onCursorAllowed" />
        <Transition>
            <FormPanel v-if="editorStore.formPanel" class="formPanel" @dragover="onCursorNotAllowed" />
        </Transition>
        <ValidationModal v-if="editorStore.validationModal" />
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
.editor-container {
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
</style>