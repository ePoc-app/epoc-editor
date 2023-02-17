<script setup lang="ts">
import { useEditorStore, useProjectStore } from '@/src/shared/stores';
import { editorService } from '@/src/shared/services';


const editorStore = useEditorStore();
const projectStore = useProjectStore();

function newProject() {
  editorService.openEpocProject();
}

function createProject() {
  editorService.newEpocProject();
}

</script>

<template>
    <div class="card card-large">
        <div class="logo">
            <img src="/img/epoc.svg" />
            <img src="/img/inria.svg" />
        </div>
        <div v-if="!editorStore.loading">
          <div class="buttons">
            <button class="btn btn-outline btn-large" @click="newProject">
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
        <div class="loading" v-if="editorStore.loading">
          <div class="spinner"></div>
          <span v-if="editorStore.currentProject.filepath">Chargement de "{{editorStore.currentProject.filepath}}"</span>
          <span v-else>Chargement de l'ePoc</span>
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

    .loading{
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .spinner{
      margin-right: 1em;
    }
}
</style>