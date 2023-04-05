<script setup lang="ts">
import SideActions from './components/SideActions.vue';

</script>

<template>
    <div class="side-bar">
        <img src="/img/epoc.svg" alt="logo ePoc" draggable="false">
        <div class="side-bar-actions">
            <SideActions />
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