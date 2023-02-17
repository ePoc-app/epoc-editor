import { ApiInterface } from '@/src/shared/interfaces/api.interface';
import { router } from '@/src/router';
import { useEditorStore } from '@/src/shared/stores';
import { ePocProject, ePocRecentProject } from '@/src/shared/interfaces';

declare var api: ApiInterface;

const editorStore = useEditorStore();

fetchRecentProjects();

api.receive('getRecentProjects', (data: string) => {
    editorStore.recentProjects = JSON.parse(data) as ePocRecentProject[];
});

api.receive('epocProjectNew', () => {
    newEpocProject();
});

api.receive('epocProjectOpened', (epocProjectPath: string) => {
    if (!epocProjectPath) return;
    editorStore.currentProject =  {
        filepath: epocProjectPath,
        workdir: null
    }
    editorStore.loading = true;
    router.push('/landingpage').then(() => {
        api.send('unzipEpocProject', epocProjectPath);
    })
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

function newEpocProject(): void {
    editorStore.loading = true;
    router.push('/landingpage').then(() => {
        api.send('newEpocProject');
    })

}

function fetchRecentProjects(): void {
    api.send('getRecentProjects');
}

function openEpocProject(): void {
    api.send('openEpocProject');
}

export const editorService = {
    newEpocProject,
    openEpocProject,
    fetchRecentProjects
}