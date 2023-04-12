<script setup lang="ts">
import TopActionButton from './TopActionButton.vue';
import TopActionDropdown from './TopActionDropdown.vue';
import { useEditorStore } from '@/src/shared/stores';
import { computed, ref } from 'vue';
import { editorService } from '@/src/shared/services';
import { useVueFlow } from '@vue-flow/core';

const editorStore = useEditorStore();
const { zoomTo, fitView, onViewportChangeEnd }  = useVueFlow({ id: 'main' });

editorStore.$subscribe(() => {
    savedSince.value = since(editorStore.currentProject.modified);
});

const savedSince = ref(since(editorStore.currentProject.modified));

const zoom = ref(1);
const zoomString = computed(() => zoom.value === 0 ? 'Ajuster' : `${Math.round(zoom.value * 100)}%`);

zoomTo(zoom.value);

onViewportChangeEnd ((event) => {
    zoom.value = event.zoom;
});

function updateZoom(val) {
    zoom.value = val;
    if (val === 0) {
        fitView({duration: 300});
    } else {
        zoomTo(val, {duration: 300});
    }
}

function since(date) {
    if (!date) return 'jamais';
    const milliseconds = Math.abs(Date.now() - new Date(date).getTime());
    const secs = Math.floor(Math.abs(milliseconds) / 1000);
    const mins = Math.floor(secs / 60);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    return 'Il y a ' + (days > 1 ? `${days} jours` : hours > 1 ? `${hours} heures` : mins > 1 ? `${mins} mins` : 'moins d\'une minute');
}

setInterval(() => {
    savedSince.value = since(editorStore.currentProject.modified);
}, 60000);

</script>

<template>
    <div class="top-bar">
        <div class="top-bar-content">
            <div class="top-bar-title">
                <h3>{{ editorStore.currentProject.filepath ? editorStore.currentProject.filepath : 'Nouvel ePoc' }}</h3>
                <small>Dernière sauvegarde : {{ savedSince }}</small>
            </div>
            <div class="top-bar-actions">
                <TopActionDropdown icon="icon-chevron" :text="zoomString" position="left" :input-value="zoom" @change="updateZoom" />
                <hr class="vertical-separator">
                <TopActionButton icon="icon-arriere" :disabled="editorStore.undoStack.length <= 0" @click="editorStore.undo" />
                <TopActionButton icon="icon-avant" :disabled="editorStore.redoStack.length <= 0" @click="editorStore.redo" />
                <hr class="vertical-separator">
                <TopActionButton icon="icon-save" text="Sauvegarder" position="right" :disabled="editorStore.saving" @click="editorService.saveEpocProject" />
                <TopActionButton icon="icon-play" text="Aperçu" position="right" :disabled="editorStore.loadingPreview" @click="editorService.runPreview()" />
                <TopActionButton icon="icon-export" text="Exporter archive" position="right" :disabled="editorStore.exporting" @click="editorService.exportProject()" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.top-bar {
    background-color: var(--content);
    border-bottom: 1px solid var(--border);
    padding-left: 1.7rem;
    user-select: none;

    &-content {
        display: flex;
        height: 100%;
    }
    &-title {
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
       * {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        display: block;
       }
       min-width: 0;
    }
    &-actions {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-left: auto;
        min-width: fit-content;
    }
    h3 {
        margin: 0 0 .2rem 0;

    }
    small {
        color: var(--text-secondary);
    }

    &-select {
        outline: none;
        padding-left: .2rem;
        appearance: none;
        width: 5rem;
        
        background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgd2lkdGg9IjExcHgiIGhlaWdodD0iN3B4IiB2aWV3Qm94PSIwIDAgMTEuMCA3LjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxjbGlwUGF0aCBpZD0iaTAiPjxwYXRoIGQ9Ik0yNDE4LDAgTDI0MTgsMjQyNiBMMCwyNDI2IEwwLDAgTDI0MTgsMCBaIj48L3BhdGg+PC9jbGlwUGF0aD48Y2xpcFBhdGggaWQ9ImkxIj48cGF0aCBkPSJNOS4yMDE3MjIyNywwIEM5LjYxNjUwNDA2LDAgOS45OTA4OTcyMSwwLjI3MzU1MDk4NyAxMC4xNDk4ODU5LDAuNjk0MzM1OTM3IEMxMC4zMDg4NzQ2LDEuMTE1MTIwODkgMTAuMjQ5ODk0OSwxLjU5OTYwOTM3IDkuOTU0OTk2NjMsMS45MTk1MzE0NiBMNS44ODA5MDQ1NSw2LjQxOTUzMTQ2IEM1LjY1MzMxOTM0LDYuNjQxMDE1NDEgNS4zOTA0NzQ3Niw2Ljc1IDUuMTI3NjMwMTksNi43NSBDNC44NjQ3ODU2Miw2Ljc1IDQuNjAyNTgxNzgsNi42NDAxMzY3MiA0LjQwMjI0Mjg2LDYuNDIwNDEwMTYgTDAuMzI4MTUwMjkxLDEuOTIwNDEwMTYgQzAuMDA2MTQ2NTU1MTksMS41OTk2MDkzNyAtMC4wODE2OTQ5MjIzLDEuMTE0NDUzMDIgMC4wNzcxMDE1NTQ3LDAuNjk2MDkzODU3IEMwLjIzNTg5ODAzMiwwLjI3NzczNDY5NyAwLjYxMDIyNzEwNiwwIDEuMDI0Njg4NTMsMCBMOS4yMDE3MjIyNywwIFoiPjwvcGF0aD48L2NsaXBQYXRoPjwvZGVmcz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTMwNC4wIC0xMDYyLjApIj48ZyBjbGlwLXBhdGg9InVybCgjaTApIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5ODAuMCA5MC4wKSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAuMCA3MjkuMCkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMCA1MS4wKSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUuMCAxNTAuMCkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMCAyNC4wKSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjg5LjM3MjM2OTgwNjgwMSAxOC4wKSI+PGcgY2xpcC1wYXRoPSJ1cmwoI2kxKSI+PHBvbHlnb24gcG9pbnRzPSItMS4xMTAyMjMwMmUtMTYsMCAxMC4yMzYwMTA0LDAgMTAuMjM2MDEwNCw2Ljc1IC0xLjExMDIyMzAyZS0xNiw2Ljc1IC0xLjExMDIyMzAyZS0xNiwwIiBzdHJva2U9Im5vbmUiIGZpbGw9IiMzNTQyNTgiPjwvcG9seWdvbj48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L3N2Zz4=");
        background-repeat: no-repeat;
        background-position: right 0.7rem top 50%;
        background-size: .8rem auto;
    }
}
</style>