<script setup lang="ts">
//? The beta version use the SideBarV0 component
//@ts-nocheck
import SideActionButton from './components/SideActionButton.vue';
import { useEditorStore } from '../../shared/stores';

const editorStore = useEditorStore();

function showFloatingMenu() {
    editorStore.floatingMenu = !editorStore.floatingMenu;
}

function showModelMenu() {
    editorStore.modelMenu = !editorStore.modelMenu;
}

</script>

<template>
    <div class="side-bar">
        <img src="../../assets/img/epoc.svg" alt="logo ePoc">
        <div class="side-bar-actions">
            <SideActionButton
                v-for="item of editorStore.getSideActionsFirstPart"
                :key="item.icon"
                :side-action="item"
                @show-menu="showFloatingMenu"
            />
            <hr class="separator">
            <SideActionButton
                v-for="item of editorStore.getSideActionsLastPart"
                :key="item.icon"
                :side-action="item"
                @show-menu="showModelMenu"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
.side-bar {
    background-color: var(--content);
    border-right: 1px solid var(--border);
    img {
        width: 80%;
        margin-top: 2rem;
        margin-left: 10%;
    }
    &-actions {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 2rem;
    }
}
</style>