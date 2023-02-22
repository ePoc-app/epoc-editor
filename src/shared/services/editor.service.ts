import { ApiInterface } from '@/src/shared/interfaces/api.interface';
import { router } from '@/src/router';
import { useEditorStore } from '@/src/shared/stores';
import { ePocProject } from '@/src/shared/interfaces';

declare const api: ApiInterface;

const editorStore = useEditorStore();

fetchRecentProjects();

api.receive('getRecentProjects', (data: string) => {
    editorStore.recentProjects = JSON.parse(data) as ePocProject[];
});

api.receive('epocProjectNew', () => {
    newEpocProject();
});

api.receive('epocProjectSaved', (data: string) => {
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
    const ePocProject = JSON.parse(data) as ePocProject;
    if (!ePocProject.workdir) {
        editorStore.loading = false;
        return;
    }
    editorStore.currentProject = ePocProject;
    router.push('/editor').then(() => {
        editorStore.loading = false;
    });
});

api.receive('previewReady', () => {
    editorStore.loadingPreview = false;
});

api.receive('projectExported', () => {
    editorStore.exporting = false;
});

function newEpocProject(): void {
    editorStore.loading = true;
    router.push('/landingpage').then(() => {
        api.send('newEpocProject');
    });

}

function fetchRecentProjects(): void {
    api.send('getRecentProjects');
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
    editorStore.loadingPreview = true;
    api.send('runPreview');
}

function exportProject(): void {
    editorStore.exporting = true;
    api.send('exportProject');
}

export const editorService = {
    newEpocProject,
    pickEpocProject,
    openEpocProject,
    saveEpocProject,
    runPreview,
    exportProject
};