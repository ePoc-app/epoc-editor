<script setup lang="ts">
import SideBar from '../components/sideBar/SideBar.vue';
import TopBar from '../components/topBar/TopBar.vue';
import ePocFlow from '../components/ePocFlow/ePocFlow.vue';
import { useEditorStore } from '../shared/stores';

const editorStore = useEditorStore();

function dismissModals() {
    editorStore.dismissModals();
}

</script>

<template>
    <div class="editor-container" @click="dismissModals">
        <SideBar class="side-bar" />
        <TopBar class="top-bar" />
        <ePocFlow class="editor-content" />
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
        grid-column: 2;
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