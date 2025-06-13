<script setup lang="ts">
import FormPanel from './FormPanel.vue';
import ResizablePanel from '@/src/components/ResizablePanel.vue';
import { useEditorStore } from '@/src/shared/stores';

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
</script>

<template>
    <ResizablePanel
        :initial-width="editorStore.formPanel.width"
        :on-resize-start="handleResizeStart"
        :on-resize-end="handleResizeEnd"
        @keydown="handleKeyDown"
    >
        <template #default="{ isMaximized, maximize, minimize }">
            <FormPanel :is-maximized="isMaximized" @maximize="maximize" @minimize="minimize" />
        </template>
    </ResizablePanel>
</template>
