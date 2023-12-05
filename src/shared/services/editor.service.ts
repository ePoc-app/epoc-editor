import { ApiInterface } from '@/src/shared/interfaces/api.interface';
import { router } from '@/src/router';
import { useEditorStore, useGraphStore, useUndoRedoStore } from '@/src/shared/stores';
import { ePocProject } from '@/src/shared/interfaces';
import { createToaster } from '@meforma/vue-toaster';
import { closeFormPanel, graphService } from '.';
import { createGraphEpocFromData } from '@/src/shared/services/import.service';
import { FlowExportObject, useVueFlow } from '@vue-flow/core';
import { saveState } from '@/src/shared/services/undoRedo.service';

const { findNode } = useVueFlow({ id: 'main' });

const toaster = createToaster({
    duration: 1000,
    queue: true
});

declare const api: ApiInterface;

const editorStore = useEditorStore();
const graphStore = useGraphStore();
let initialized = false;
let currentToastStartTime: number;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let currentToast: any;

const waitingToast = function (message: string) {
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
        const undoRedoStore = useUndoRedoStore(); 

        const parsedData = JSON.parse(data);
        const ePocProject = parsedData.project as ePocProject;
        if (!ePocProject.workdir) {
            editorStore.loading = false;
            return;
        }
        
        closeFormPanel();
        editorStore.currentProject = ePocProject;

        parsedData.flow = changeScreenToPage(parsedData.flow);

        graphStore.setFlow(parsedData.flow);
        
        undoRedoStore.reset();
        editorStore.reset();

        router.push('/editor').then(() => {
            editorStore.loading = false;
        });
    });
    
    api.receive('epocProjectError', () => {
        waitingToastDismiss();
        toaster.error('😵 Une erreur s\'est produite');
        editorStore.loading = false;
    });

    api.receive('epocImportPicked', () => {
        editorStore.loading = true;
        // noinspection JSIgnoredPromiseFromCall
        router.push('/landingpage');
    });

    api.receive('epocImportExtracted', (data: string) => {
        const importedEpoc =  JSON.parse(data);
        graphStore.setFlow(null);
        router.push('/editor').then(() => {
            editorStore.loading = false;
            if (!importedEpoc || !importedEpoc.workdir) return;
            
            createGraphEpocFromData(importedEpoc.epoc);
            saveState();
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

function openEpocProject(project: ePocProject): void {
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

function runPreviewAtPage(): void {
    waitingToast('🔭 Démarrage de la prévisualisation...');
    const openedNodeId = editorStore.openedNodeId ?? editorStore.openedElementId;
    const openedNode = findNode(openedNodeId);
    // const openedNode = graphStore.elements.find(e => e.id === openedNodeId);
    let contentPath: string;
    let error: boolean;
    if (openedNode) {
        if (openedNode.type === 'epoc') {
            // do nothing
        } else if (openedNode.type === 'chapter') {
            contentPath = openedNode.data.contentId;
        } else {
            let prevNode = graphService.getPreviousNode(openedNode);
            while (prevNode && prevNode.type !== 'chapter') {
                prevNode = graphService.getPreviousNode(prevNode);
            }
            if (prevNode) {
                contentPath = `${prevNode.data.contentId}/content/${openedNode.data.contentId}`;
            } else {
                error = true;
                waitingToastDismiss();
                toaster.warning('🚨Contenu orphelin non visualisable', {duration: 3000});
            }
        }
    }

    if (!error) {
        editorStore.loadingPreview = true;
        api.send('runPreview',  contentPath);
    }
}

function exportProject(): void {
    waitingToast('⚙️ Export en cours...');
    editorStore.exporting = true;
    api.send('exportProject');
}

export const editorService = {
    setup,
    newEpocProject,
    pickEpocProject,
    openEpocProject,
    saveEpocProject,
    runPreview,
    runPreviewAtPage,
    exportProject,
};


//TODO: delete backward support for old page form
function changeScreenToPage(flow: FlowExportObject) {
    if(!flow) return;

    const pages = flow.nodes.filter(node => node.type === 'content');
    for(const page of pages) {
        if(page.data.formType === 'screen') page.data.formType = 'page';
    }
    return flow;
}