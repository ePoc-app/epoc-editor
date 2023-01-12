<script setup lang="ts">
import TopBar from '../features/topBar/TopBar.vue';
import ePocFlow from '../features/ePocFlow/ePocFlow.vue';
import { useEditorStore } from '../shared/stores';
import SideBarV0 from '../features/sideBar/SideBarV0.vue';
import FormPanel from '../features/forms/FormPanel.vue';

const editorStore = useEditorStore();

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
    grid-template-columns: 100px auto;
    grid-template-rows: 80px auto;

    .side-bar {
        grid-column: 1;
        grid-row: 1 / 3;
    }

    .top-bar {
        grid-column: 1/3;
        //for v2: 
        //grid-column: 2;
        grid-row: 1;
    }

    .editor-content {
        margin: 0;
        grid-column: 2;
        grid-column: 2;
        margin: auto;
    }
}
</style>