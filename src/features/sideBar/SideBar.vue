<script setup lang="ts">
import SideActions from './components/SideActions.vue';
import ModelMenu from './components/ModelMenu.vue';
import { useEditorStore } from '@/src/shared/stores';

const editorStore = useEditorStore();
</script>

<template>
    <div class="side-bar">
        <img src="/img/epoc.svg" alt="logo ePoc" draggable="false" />
        <div class="side-bar-actions">
            <SideActions />
        </div>
        <ModelMenu v-if="editorStore.modelMenu" />
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
        margin-bottom: 0.5rem;
        user-select: none;
    }
    &-actions {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 2rem;
        gap: 1rem;
    }
}
</style>
