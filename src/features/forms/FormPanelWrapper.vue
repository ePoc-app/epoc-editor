<script setup lang="ts">
import { computed } from 'vue';
import FormPanel from './FormPanel.vue';
import ResizablePanel from '@/src/components/ResizablePanel.vue';
import { useEditorStore } from '@/src/shared/stores';
import { closeFormPanel } from '@/src/shared/services';
import { useSideBarStore } from '../sideBar/stores/sideBarStore';

const editorStore = useEditorStore();
const sidebarStore = useSideBarStore();

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
    sidebarStore.questionMenu = false;
}

function handleResizeEnd(width: number) {
    editorStore.formPanel.width = width;
}

function handleClose() {
    closeFormPanel();
}

const contentId = computed(() => editorStore.getCurrentContentId);
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
            <div class="header">
                <div class="title">
                    <div class="form-icon"><i :class="editorStore.formPanel.form.icon"></i></div>
                    <h1>{{ editorStore.formPanel.form.name }}</h1>
                </div>

                <p v-if="contentId" class="description">
                    {{ contentId }}
                    <i
                        v-tippy="{
                            content: $t('global.contentId'),
                            placement: 'top',
                            allowHTML: true,
                            arrow: true,
                            arrowType: 'round',
                            animation: 'fade',
                        }"
                        class="icon-help-circle"
                    />
                </p>
            </div>
        </template>

        <template #default>
            <FormPanel />
        </template>
    </ResizablePanel>
</template>

<style scoped lang="scss">
.header {
    margin-top: 2.5rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;

    .title {
        display: flex;
        align-items: center;
        flex: 1;

        h1 {
            margin: 0 0 0 1rem;
        }
        .form-icon {
            transform: translate(0, 0.2rem);
        }
    }

    .description {
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        color: var(--text-secondary);
    }
}
</style>
