<script setup lang="ts">
import TopBar from '@/src/features/topBar/TopBar.vue';
import EPocFlow from '@/src/features/ePocFlow/ePocFlow.vue';
import SideBarV0 from '@/src/features/sideBar/SideBarV0.vue';
import FormPanel from '@/src/features/forms/FormPanel.vue';
import { useEditorStore } from '@/src/shared/stores';
import { editorService } from '@/src/shared/services';

const editorStore = useEditorStore();

editorService.setup();

function dismissModals() {
    editorStore.dismissModals();
}

</script>

<template>
    <div class="editor-container" @click="dismissModals">
        <SideBarV0 class="side-bar" />
        <TopBar class="top-bar" />
        <ePocFlow class="editor-content" />
        <FormPanel v-if="editorStore.formPanel.isOpen" class="formPanel" />
    </div>
</template>

<style scoped lang="scss">
.editor-container {
    display: grid;
    height: 100%;
    grid-template-columns: 265px auto;
    grid-template-rows: 80px auto;

    .side-bar {
        grid-column: 1;
        grid-row: 1 / 3;
    }

    .top-bar {
        grid-column: 1/3;
        grid-row: 1;
    }

    .editor-content {
        grid-column: 2;
        margin: auto;
    }
}
</style>