<script setup lang="ts">
import FormPanel from './FormPanel.vue';
import ResizablePanel from '@/src/components/ResizablePanel.vue';
import { useEditorStore } from '@/src/shared/stores';
import { closeFormPanel } from '@/src/shared/services';

const editorStore = useEditorStore();

function handleKeyDown(event: KeyboardEvent) {
    const { key, metaKey, ctrlKey } = event;
    if (metaKey || ctrlKey) {
        if (key === 'v') {
            event.stopPropagation();
        }
    }
}

function handleResizeStart() {
    // Close the question menu when resizing
    editorStore.questionMenu = false;
}

function handleResizeEnd(width: number) {
    editorStore.formPanel.width = width;
}

function handleClose() {
    closeFormPanel();
}
</script>

<template>
    <ResizablePanel
        :initial-width="editorStore.formPanel.width"
        :title="editorStore.formPanel.form.name"
        :on-resize-start="handleResizeStart"
        :on-resize-end="handleResizeEnd"
        :on-close="handleClose"
        @keydown="handleKeyDown"
    >
        <template #default>
            <FormPanel />
        </template>
    </ResizablePanel>
</template>
