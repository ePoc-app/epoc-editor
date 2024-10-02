<script setup lang="ts">
import { addChapter } from '@/src/shared/services/graph';
import { saveState } from '@/src/shared/services/undoRedo.service';
import { useEditorStore } from '@/src/shared/stores';
import { NodeProps } from '@vue-flow/core';

const editorStore = useEditorStore();

defineProps<Partial<NodeProps>>();

function onClick() {
    if (editorStore.selectNodeMode) return;
    saveState();
    addChapter();
}
</script>

<template>
    <div class="add-chapter" @mousedown="onClick()">
        <button data-testid="add-chapter" class="add-btn"><i class="icon-plus"></i></button>
    </div>
</template>

<style scoped lang="scss">
.add-btn {
    border-radius: 50%;
    height: 31px;
    width: 31px;
    background-color: var(--content);
    border: 1px solid var(--border);
    font-size: 0.7rem;
    cursor: pointer;
    transition: box-shadow 0.1s ease-in-out;
    &:hover {
        box-shadow: 0 1px 5px var(--shadow-outer);
    }
    &:active {
        opacity: 0.7;
    }
}
</style>
