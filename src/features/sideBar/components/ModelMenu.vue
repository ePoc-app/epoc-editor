<script setup lang="ts">
import PageTemplate from './PageTemplate.vue';
import { useEditorStore } from '@/src/shared/stores';
import { ref } from 'vue';

const editorStore = useEditorStore();

const leftCol = ref(editorStore.pageModels.filter((value, index) => index % 2 === 0));
const rightCol = ref(editorStore.pageModels.filter((value, index) => index % 2 !== 0));

</script>

<template>
    <div class="model-menu">
        <header>
            <h3>Modèles de page</h3>
            <button class="btn btn-close"><i class="icon-x"></i></button>
        </header>
        <hr class="separator">
        <div v-if="leftCol.length > 0" class="models">
            <div class="col col-left">
                <PageTemplate
                    v-for="(model, index) in leftCol"
                    :key="index"
                    :elements="model.actions"
                    :name="model.name"
                />
            </div>
            <div class="col col-right">
                <PageTemplate
                    v-for="(model, index) in rightCol"
                    :key="index"
                    :elements="model.actions"
                    :name="model.name"
                />
            </div>
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
    width: fit-content;
    background-color: white;
    border-right: 1px solid var(--border);
    min-width: calc(8rem + 120px);

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
        flex-direction: row;
        gap: 2rem;
        padding: 1rem;
    }

    .col {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
}
</style>