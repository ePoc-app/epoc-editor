<script setup lang="ts">
import { useEditorStore } from '@/src/shared/stores';
import { editorService } from '@/src/shared/services';
import { ePocProject } from '@/src/shared/interfaces';
import ChoiceModal from '@/src/components/ChoiceModal.vue';
import { createGraphFromImport } from '@/src/shared/services/import.service';

const editorStore = useEditorStore();

editorService.setup();

function pickProject() {
    editorService.pickEpocProject();
}
function openProject(filepath: ePocProject) {
    editorService.openEpocProject(filepath);
}

function createProject() {
    editorService.newEpocProject();
}

function cancelImport() {
    editorStore.projectToImport = null;
    editorStore.loading = false;
}

function importProject() {
    createGraphFromImport(JSON.parse(editorStore.projectToImport));
    editorStore.projectToImport = null;
}
</script>

<template>
    <div class="card card-large landing-page">
        <div class="logo">
            <img alt="logo epoc" src="/img/epoc.svg" />
            <img alt="logo inria" src="/img/inria.svg" />
        </div>

        <ChoiceModal
            v-if="editorStore.projectToImport"
            accept-label="Importer"
            @accept="importProject"
            @cancel="cancelImport"
        >
            <h3>{{ $t('landing.published') }}</h3>
        </ChoiceModal>

        <div v-if="editorStore.loading" class="loading">
            <div class="spinner"></div>
            <span v-if="editorStore.currentProject.filepath">
                {{ $t('landing.loadingPath', { path: editorStore.currentProject.filepath }) }}
            </span>
            <span v-else>Chargement de l'ePoc</span>
        </div>

        <div v-else>
            <div class="buttons">
                <button class="btn btn-outline btn-large" @click="pickProject">
                    <i class="icon-ouvrir" />
                    {{ $t('landing.open') }}
                </button>
                <button class="btn btn-outline btn-large" @click="createProject">
                    <i class="icon-creer" />
                    {{ $t('landing.create') }}
                </button>
            </div>
            <div>
                <h3>{{ $t('landing.recents') }}</h3>
                <hr class="separator" />
                <div v-for="epoc of editorStore.recentProjects" :key="epoc.name" class="card-list-item">
                    <div class="card-icon">
                        <i class="icon-fichier" />
                    </div>
                    <p>
                        <span class="tooltip" :data-text="epoc.filepath">{{ epoc.name }}</span>
                    </p>
                    <small>{{ new Date(epoc.modified).toLocaleString() }}</small>
                    <hr class="vertical-separator" />
                    <div class="btn-open" @click="openProject(epoc)">{{ $t('global.open') }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.landing-page {
    margin: auto;
}

.card {
    font-weight: bold;
    .btn-open {
        color: var(--inria-red);
        margin-right: 1rem;
        cursor: pointer;
    }
    h3 {
        margin-bottom: 0.7rem;
    }

    .logo,
    .buttons {
        display: flex;
        justify-content: space-between;
        margin-bottom: 2rem;
    }

    .loading {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .spinner {
        margin-right: 1em;
    }

    .tooltip {
        position: relative;

        &:before {
            content: attr(data-text);
            display: none;
            position: absolute;

            top: 50%;
            transform: translateY(-50%);

            left: 100%;
            margin-left: 8px;

            padding: 5px;
            border-radius: 5px;
            background: #222;
            color: #fff;
            font-size: 0.8em;
            font-weight: normal;
            line-height: 1;
            text-align: center;
        }

        &:after {
            content: '';
            position: absolute;

            left: 100%;
            margin-left: -3px;

            top: 50%;
            transform: translateY(-50%);

            border: 6px solid transparent;
            border-right-color: #222;

            display: none;
        }

        &:hover:before,
        &:hover:after {
            display: block;
        }
    }
}
</style>
