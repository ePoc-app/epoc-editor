<script setup lang="ts">
import { useEditorStore } from '@/src/shared/stores';
import SideActionButtonV0 from './components/SideActionButtonV0.vue';

const editorStore = useEditorStore();

</script>

<template>
    <div class="side-bar">
        <img src="@/public/img/epoc.svg" alt="logo ePoc" draggable="false">
        <div class="side-bar-actions">
            <SideActionButtonV0
                v-for="item of editorStore.standardScreens"
                :key="item.icon"
                v-tippy="{content: editorStore.floatingMenu ? null : item.tooltip, placement: 'right', arrow : true, arrowType : 'round', animation : 'fade'}"
                :side-action="item"
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
        margin-bottom: .5rem;
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