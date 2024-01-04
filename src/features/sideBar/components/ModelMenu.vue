<script setup lang="ts">
import PageTemplate from './PageTemplate.vue';
import { useEditorStore } from '@/src/shared/stores';

const editorStore = useEditorStore();
</script>

<template>
    <div class="model-menu">
        <header>
            <h3>Modèles de page</h3>
            <button class="btn btn-close"><i class="icon-x"></i></button>
        </header>
        <hr class="separator" />
        <div v-if="editorStore.pageModels.length > 0" class="models">
            <PageTemplate
                v-for="(model, index) in editorStore.pageModels"
                :key="index"
                :elements="model.actions"
                :name="model.name"
            />
        </div>
        <div v-else>
            <h4 class="empty">Aucun modèle de page n'as été créé</h4>
        </div>
    </div>
</template>

<style scoped lang="scss">
.model-menu {
    z-index: 100;
    position: fixed;
    top: 0;
    left: 100px;
    height: 100vh;
    background-color: white;
    border-right: 1px solid var(--border);

    // All the padding + 2 nodes + all border
    width: calc(8rem + 120px + 16px);

    header {
        h3 {
            margin-left: 1rem;
        }
    }

    hr {
        margin-bottom: 1rem;
    }

    .empty {
        width: calc(6rem + 120px);
        text-align: center;
        padding: 1rem;
        h4 {
            margin: 1rem;
        }
    }

    .models {
        display: flex;
        gap: 2rem;
        padding: 1rem;
        flex-wrap: wrap;
        margin: 0;
    }
}
</style>
