import { ApiInterface } from '@/src/shared/interfaces/api.interface';
import { router } from '@/src/router';
import { useEditorStore, useProjectStore } from '@/src/shared/stores';
import { ePocProject } from '@/src/shared/interfaces';
import { createToaster } from '@meforma/vue-toaster';
import { EpocV1 } from '@/src/shared/classes/epoc-v1';

const toaster = createToaster({
    duration: 1000,
    queue: true
});

declare const api: ApiInterface;

const editorStore = useEditorStore();
const projectStore = useProjectStore();
let initialized = false;
let currentToastStartTime;
let currentToast;

const waitingToast = function (message) {
    currentToastStartTime = performance.now();
    currentToast = toaster.show(message, {duration: false});
};

const waitingToastDismiss = function () {
    if (currentToast) {
        setTimeout(currentToast.destroy, 1000 - (performance.now() - currentToastStartTime));
    }
};

const setup = function () {
    if (initialized) return;
    fetchRecentProjects();
    fetchCurrentProject();

    api.receive('getRecentProjects', (data: string) => {
        editorStore.recentProjects = JSON.parse(data) as ePocProject[];
    });

    api.receive('epocProjectNew', () => {
        newEpocProject();
    });

    api.receive('epocProjectSaving', () => {
        editorStore.saving = true;
        waitingToast('💾 Sauvegarde en cours...');
    });

    api.receive('epocProjectSaveCanceled', () => {
        waitingToastDismiss();
        editorStore.saving = false;
    });

    api.receive('epocProjectSaved', (data: string) => {
        waitingToastDismiss();
        toaster.success('Projet sauvegardé 💪');
        editorStore.saving = false;
        const currentProject =  JSON.parse(data) as ePocProject;
        if (!currentProject || !currentProject.filepath) return;
        editorStore.currentProject = currentProject;
    });

    api.receive('epocProjectPicked', (data: string) => {
        const currentProject =  JSON.parse(data) as ePocProject;
        if (!currentProject || !currentProject.filepath) return;
        openEpocProject(currentProject);
    });

    api.receive('epocProjectReady', (data: string) => {
        const parsedData = JSON.parse(data);
        const ePocProject = parsedData.project as ePocProject;
        if (!ePocProject.workdir) {
            editorStore.loading = false;
            return;
        }
        editorStore.closeFormPanel();
        editorStore.currentProject = ePocProject;

        projectStore.setFlow(parsedData.flow);

        router.push('/editor').then(() => {
            editorStore.loading = false;
        });
    });

    api.receive('epocImportPicked', () => {
        editorStore.loading = true;
    });

    api.receive('epocImportExtracted', (data: string) => {
        const importedEpoc =  JSON.parse(data);
        editorStore.loading = false;
        if (!importedEpoc || !importedEpoc.workdir) return;
        router.push('/editor').then(() => {
            generateEpocFromData(importedEpoc.epoc);
        });
    });

    api.receive('previewReady', () => {
        waitingToastDismiss();
        editorStore.loadingPreview = false;
    });

    api.receive('previewError', () => {
        waitingToastDismiss();
        toaster.error('😵 Une erreur s\'est produite');
        editorStore.loadingPreview = false;
    });

    api.receive('projectExported', () => {
        waitingToastDismiss();
        editorStore.exporting = false;
    });

    api.receive('exportError', () => {
        waitingToastDismiss();
        toaster.error('😵 Une erreur s\'est produite');
        editorStore.exporting = false;
    });

    initialized = true;
};
function newEpocProject(): void {
    editorStore.loading = true;
    router.push('/landingpage').then(() => {
        api.send('newEpocProject');
    });

}

function fetchRecentProjects(): void {
    api.send('getRecentProjects');
}

function fetchCurrentProject(): void {
    api.send('getCurrentProject');
}

function pickEpocProject(): void {
    api.send('pickEpocProject');
}

function openEpocProject(project): void {
    editorStore.currentProject = project;
    editorStore.loading = true;
    router.push('/landingpage').then(() => {
        api.send('openEpocProject', project.filepath);
    });
}

function saveEpocProject(): void {
    editorStore.saving = true;
    api.send('saveEpocProject');
}

function runPreview(): void {
    waitingToast('🔭 Démarrage de la prévisualisation...');
    editorStore.loadingPreview = true;
    api.send('runPreview');
}

function exportProject(): void {
    waitingToast('⚙️ Export en cours...');
    editorStore.exporting = true;
    api.send('exportProject');
}

function generateEpocFromData(epoc: EpocV1) {
    console.log(epoc);
    projectStore.setEpocNodeData(epoc);
    for (const [chapterId, chapter] of Object.entries(epoc.chapters)) {
        projectStore.addChapter(chapterId, chapter);
    }
}

export const editorService = {
    setup,
    newEpocProject,
    pickEpocProject,
    openEpocProject,
    saveEpocProject,
    runPreview,
    exportProject
};