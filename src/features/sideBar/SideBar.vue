<script setup lang="ts">
import SideActions from './components/SideActions.vue';

</script>

<template>
    <div class="side-bar">
        <img src="/img/epoc.svg" alt="logo ePoc" draggable="false" />
        <SideActions class="side-bar-actions" />
    </div>
</template>

<style scoped lang="scss">
.side-bar {
    background-color: var(--content);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding-bottom: 1rem;
    img {
        width: 80%;
        margin-top: 2rem;
        margin-left: 10%;
        margin-bottom: 0.5rem;
        user-select: none;
    }
    &-actions {
        align-items: center;
        margin-top: 2rem;
    }
}
</style>
