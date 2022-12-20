<script setup lang="ts">
import SideActionButton from './SideActionButton.vue';

const actions = [
    {
        icon: 'icon-texte'
    },
    {
        icon: 'icon-video'
    },
    {
        icon: 'icon-audio'
    },
    {
        icon: 'icon-question'
    },
    {
        icon: 'icon-condition'
    },
    {
        icon: 'icon-javascript'
    },
];
</script>

<template>
    <div class="side-bar">
        <img src="../assets/img/epoc.svg" alt="logo ePoc">
        <div class="side-bar-actions">
            <SideActionButton
                v-for="(action) in actions"
                :key="action.icon"
                :icon="action.icon"
            />
            <hr class="separator">
            <SideActionButton
                icon="icon-modele"
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