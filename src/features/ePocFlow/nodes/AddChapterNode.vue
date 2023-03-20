<script setup lang="ts">
import { useProjectStore } from '@/src/shared/stores';

const projectStore = useProjectStore();

</script>

<template>
    <div class="add-chapter" @click="projectStore.addChapter()">
        <button class="add-btn"><i class="icon-plus"></i></button>
    </div>
</template>

<style scoped lang="scss">
.add-btn {
    border-radius: 50%;
    height: 31px;
    width: 31px;
    background-color: var(--content);
    border: 1px solid var(--border);
    font-size: .7rem;
    cursor: pointer;
    transition: box-shadow .1s ease-in-out;
    &:hover {
        box-shadow: 0 1px 5px var(--shadow-outer);
    }
    &:active {
        opacity: .7;
    }
}
</style>