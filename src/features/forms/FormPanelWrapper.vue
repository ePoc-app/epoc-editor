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
    // Close question menu when resizing
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
        min-width="20rem"
        @resize-start="handleResizeStart"
        @resize-end="handleResizeEnd"
        @close="handleClose"
        @keydown="handleKeyDown"
    >
        <template #title>
            <div class="title">
                <div class="form-icon"><i :class="editorStore.formPanel.form.icon"></i></div>
                <h1>{{ editorStore.formPanel.form.name }}</h1>
            </div>
        </template>

        <template #default>
            <FormPanel />
        </template>
    </ResizablePanel>
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
</style>
