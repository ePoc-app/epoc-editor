<script setup lang="ts">
import TopActionButton from './TopActionButton.vue';
</script>

<template>
    <div class="top-bar">
        <div class="top-bar-content">
            <div class="top-bar-title">
                <h3>L'intelligence artificielle pour tous</h3>
                <small>Dernière sauvegarde: Il y a 3 minutes</small>
            </div>
            <div class="top-bar-actions">
                <TopActionButton icon="icon-chevron" text-before="100%" />
                <hr class="vertical-separator">
                <TopActionButton icon="icon-arriere" />
                <TopActionButton icon="icon-avant" />
                <hr class="vertical-separator">
                <TopActionButton icon="icon-play" text="Aperçu" />
                <TopActionButton icon="icon-export" text="Exporter archive" />
                <TopActionButton icon="icon-save" text="Sauvegarder" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.top-bar {
    background-color: var(--content);
    border-bottom: 1px solid var(--border);
    padding-left: 1.7rem;

    &-content {
        display: flex;
        height: 100%;
    }
    &-title {
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
       * {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        display: block;
       }
       min-width: 0;
    }
    &-actions {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-left: auto;
        min-width: fit-content;
    }
    h3 {
        margin: 0 0 .2rem 0;

    }
    small {
        color: var(--text-secondary);
    }
}
</style>