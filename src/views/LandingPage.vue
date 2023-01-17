<script setup lang="ts">
import { router } from '../router';
import { useEditorStore, useProjectStore } from '../shared/stores';


const editorStore = useEditorStore();
editorStore.fetchRecentProjects();

const projectStore = useProjectStore();

function createProject() {
    router.push('/editor');
}

</script>

<template>
    <div class="card card-large">
        <div class="logo">
            <img src="/img/epoc.svg" />
            <img src="/img/inria.svg" />
        </div>
        <div class="buttons">
            <button class="btn btn-outline btn-large" @click="projectStore.openEPOC">
                <i class="icon-ouvrir" />
                Ouvrir un projet existant
            </button>
            <button class="btn btn-outline btn-large" @click="createProject">
                <i class="icon-creer" />
                Créer un nouveau projet
            </button>
        </div>
        <div>
            <h3>Fichiers récents</h3>
            <hr class="separator" />
            <div v-for="epoc of editorStore.recentProjects" :key="epoc.name" class="card-list-item">
                <div class="card-icon">
                    <i class="icon-fichier" />
                </div>
                <p>{{ epoc.name }}</p>
                <small>{{ epoc.modified }}</small>
                <hr class="vertical-separator" />
                <div class="btn-open">
                    Ouvrir
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.card {
    font-weight: bold;
    .btn-open {
        color: var(--inria-red);
        margin-right: 1rem;
        cursor: pointer;
    }
    h3 {
        margin-bottom: .7rem;
    }
    
    .logo, .buttons {
        display: flex;
        justify-content: space-between;
        margin-bottom: 2rem;
    }

}
</style>