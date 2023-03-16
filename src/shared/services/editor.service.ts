import { ApiInterface } from '@/src/shared/interfaces/api.interface';
import { router } from '@/src/router';
import { useEditorStore, useProjectStore } from '@/src/shared/stores';
import { ePocProject } from '@/src/shared/interfaces';
import { createToaster } from '@meforma/vue-toaster';
import { EpocV1 } from '@/src/shared/classes/epoc-v1';
import { Assessment, SimpleQuestion } from '@epoc/epoc-specs/dist/v1';
import { projectService } from '@/src/shared/services/project.service';

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
        router.push('/landingpage');
    });

    api.receive('epocImportExtracted', (data: string) => {
        const importedEpoc =  JSON.parse(data);
        projectStore.setFlow(null);
        router.push('/editor').then(() => {
            editorStore.loading = false;
            if (!importedEpoc || !importedEpoc.workdir) return;
            generateFlowEpocFromData(importedEpoc.epoc);
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

    api.receive('addPage', (data: string) => {
        const page = JSON.parse(data);
        editorStore.addNewPage(page.type, page.pos);
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
    const openedNodeId = editorStore.openedParentId ? editorStore.openedParentId : editorStore.openedNodeId;
    const openedNode = projectStore.elements.find(e => e.id === openedNodeId);
    let contentPath;
    let error;
    if (openedNode) {
        if (openedNode.type === 'epoc') {
            // do nothing
        } else if (openedNode.type === 'chapter') {
            contentPath = openedNode.data.contentId;
        } else {
            let prevNode = projectService.getPreviousNode(openedNode);
            while (prevNode && prevNode.type !== 'chapter') {
                prevNode = projectService.getPreviousNode(prevNode);
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

function generateFlowEpocFromData(epoc: EpocV1) {
    console.log(epoc);
    projectStore.setEpocNodeData(epoc);
    for (const [chapterId, chapter] of Object.entries(epoc.chapters)) {
        let currentNode = projectStore.addChapter(chapterId, chapter);
        for (const contentId of chapter.contents) {
            const content = epoc.contents[contentId];
            const id = editorStore.generateId();
            const action = {
                icon: '',
                type: ''
            };
            const mapType = {
                'video': 'video',
                'html': 'text',
                'multiple-choice': 'qcm',
                'choice': 'qcm',
                'drag-and-drop': 'dragdrop',
                'dropdown-list': 'list',
                'swipe': 'swipe',
                'reorder': 'reorder'
            };
            const mapIcon = {
                'video': 'icon-video',
                'html': 'icon-texte',
                'multiple-choice': 'icon-qcm',
                'choice': 'icon-qcm',
                'drag-and-drop': 'icon-dragdrop',
                'dropdown-list': 'icon-liste',
                'swipe': 'icon-swipe',
                'reorder': 'icon-reorder'
            };
            const contentElements = [];
            const contentElement = {
                id: editorStore.generateId(),
                action: action,
                formType: mapType[content.type],
                formValues: {},
                parentId: id,
                contentId: editorStore.generateContentId()
            };
            if (content.type === 'assessment') {
                (content as Assessment).questions.forEach((qid) => {
                    const question = epoc.questions[qid];
                    const contentElement = {
                        id: editorStore.generateId(),
                        action: {
                            icon:mapIcon[question.type],
                            type:mapType[question.type]
                        },
                        formType: mapType[question.type],
                        formValues: {},
                        parentId: id,
                        contentId: editorStore.generateContentId()
                    };
                    contentElements.push(contentElement);
                });
            } else if (content.type === 'simple-question') {
                const question = epoc.questions[(content as SimpleQuestion).question];
                contentElement.formType = mapType[question.type];
                contentElement.action.type = mapType[question.type];
                contentElement.action.icon = mapIcon[question.type];
                contentElements.push(contentElement);
            } else {
                contentElement.action.type = mapType[content.type];
                contentElement.action.icon = mapIcon[content.type];
                contentElements.push(contentElement);
            }
            currentNode = projectStore.createNodeLinkedNextNode(currentNode, contentElements);
        }
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