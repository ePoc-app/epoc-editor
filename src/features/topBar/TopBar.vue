<script setup lang="ts">
import { useEditorStore, useUndoRedoStore } from '@/src/shared/stores';
import { computed } from 'vue';
import { editorService } from '@/src/shared/services';
import TopActionsMenu from '@/src/features/topBar/TopActionsMenu.vue';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

const editorStore = useEditorStore();
const undoRedoStore = useUndoRedoStore();

const savedSince = computed(() => {
    const date = editorStore.currentProject.modified;
    if (!date) return t('header.never');
    const milliseconds = Math.abs(Date.now() - new Date(date).getTime());
    const secs = Math.floor(Math.abs(milliseconds) / 1000);
    const mins = Math.floor(secs / 60);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (locale.value === 'fr') {
        return (
            'Il y a ' +
            (days > 1 ? `${days} jours`
                : hours > 1 ? `${hours} heures`
                    : mins > 1 ? `${mins} mins`
                        : "moins d'une minute")
        );
    } else {
        return (
            (days > 1
                ? `${days} days`
                : hours > 1
                    ? `${hours} hours`
                    : mins > 1
                        ? `${mins} mins`
                        : 'less than a minute') + ' ago'
        );
    }
});

function separateFilePath(filepath: string) {
    const file = filepath.split('/').pop();
    return [filepath.replace('/' + file, ''), '/' + file];
}
</script>

<template>
    <div class="top-bar">
        <div class="top-bar-content">
            <div class="top-bar-title">
                <h3 v-if="!editorStore.currentProject.filepath">{{ t('header.new') }}</h3>
                <h3 v-else>
                    <span>{{ separateFilePath(editorStore.currentProject.filepath)[0] }}</span>
                    {{ separateFilePath(editorStore.currentProject.filepath)[1] }}
                </h3>
                <small>{{ t('header.lastSave') }} {{ savedSince }}</small>
            </div>
            <TopActionsMenu
                :undo-disabled="undoRedoStore.undoStack.length <= 0"
                :redo-disabled="undoRedoStore.redoStack.length <= 0"
                :saving="editorStore.saving"
                :loading-preview="editorStore.loadingPreview"
                :exporting="editorStore.exporting"
                @undo="undoRedoStore.undo()"
                @redo="undoRedoStore.redo()"
                @save="editorService.saveEpocProject"
                @run-preview="editorService.runPreviewAtPage()"
                @export-project="editorService.exportProject()"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/src/mixins';

.top-bar {
    background-color: var(--content);
    border-bottom: 1px solid var(--border);
    padding-left: 1.7rem;
    user-select: none;

    &-content {
        display: flex;
        justify-content: space-between;
        height: 100%;
        overflow: hidden;
    }
    &-title {
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
        min-width: 0;
        flex: 1;
        margin-right: 1rem;
        transition: all 0.2s ease-in-out;

        * {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            display: block;
        }

        h3 {
            display: flex;
            max-width: 25rem;
            transition: all 0.1s ease-in-out;

            &:hover {
                max-width: 100vw;
            }
        }
    }
    h3 {
        margin: 0 0 0.2rem 0;
    }
    small {
        color: var(--text-secondary);
    }

    &-select {
        outline: none;
        padding-left: 0.2rem;
        appearance: none;
        width: 5rem;

        background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgd2lkdGg9IjExcHgiIGhlaWdodD0iN3B4IiB2aWV3Qm94PSIwIDAgMTEuMCA3LjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxjbGlwUGF0aCBpZD0iaTAiPjxwYXRoIGQ9Ik0yNDE4LDAgTDI0MTgsMjQyNiBMMCwyNDI2IEwwLDAgTDI0MTgsMCBaIj48L3BhdGg+PC9jbGlwUGF0aD48Y2xpcFBhdGggaWQ9ImkxIj48cGF0aCBkPSJNOS4yMDE3MjIyNywwIEM5LjYxNjUwNDA2LDAgOS45OTA4OTcyMSwwLjI3MzU1MDk4NyAxMC4xNDk4ODU5LDAuNjk0MzM1OTM3IEMxMC4zMDg4NzQ2LDEuMTE1MTIwODkgMTAuMjQ5ODk0OSwxLjU5OTYwOTM3IDkuOTU0OTk2NjMsMS45MTk1MzE0NiBMNS44ODA5MDQ1NSw2LjQxOTUzMTQ2IEM1LjY1MzMxOTM0LDYuNjQxMDE1NDEgNS4zOTA0NzQ3Niw2Ljc1IDUuMTI3NjMwMTksNi43NSBDNC44NjQ3ODU2Miw2Ljc1IDQuNjAyNTgxNzgsNi42NDAxMzY3MiA0LjQwMjI0Mjg2LDYuNDIwNDEwMTYgTDAuMzI4MTUwMjkxLDEuOTIwNDEwMTYgQzAuMDA2MTQ2NTU1MTksMS41OTk2MDkzNyAtMC4wODE2OTQ5MjIzLDEuMTE0NDUzMDIgMC4wNzcxMDE1NTQ3LDAuNjk2MDkzODU3IEMwLjIzNTg5ODAzMiwwLjI3NzczNDY5NyAwLjYxMDIyNzEwNiwwIDEuMDI0Njg4NTMsMCBMOS4yMDE3MjIyNywwIFoiPjwvcGF0aD48L2NsaXBQYXRoPjwvZGVmcz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTMwNC4wIC0xMDYyLjApIj48ZyBjbGlwLXBhdGg9InVybCgjaTApIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5ODAuMCA5MC4wKSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAuMCA3MjkuMCkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMCA1MS4wKSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUuMCAxNTAuMCkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMCAyNC4wKSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjg5LjM3MjM2OTgwNjgwMSAxOC4wKSI+PGcgY2xpcC1wYXRoPSJ1cmwoI2kxKSI+PHBvbHlnb24gcG9pbnRzPSItMS4xMTAyMjMwMmUtMTYsMCAxMC4yMzYwMTA0LDAgMTAuMjM2MDEwNCw2Ljc1IC0xLjExMDIyMzAyZS0xNiw2Ljc1IC0xLjExMDIyMzAyZS0xNiwwIiBzdHJva2U9Im5vbmUiIGZpbGw9IiMzNTQyNTgiPjwvcG9seWdvbj48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L3N2Zz4=');
        background-repeat: no-repeat;
        background-position: right 0.7rem top 50%;
        background-size: 0.8rem auto;
    }
}
</style>
