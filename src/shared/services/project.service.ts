import { ApiInterface } from '@/src/shared/interfaces/api.interface';
import { useProjectStore } from '../stores';
import { getConnectedEdges, GraphNode, useVueFlow } from '@vue-flow/core';
import { EpocV1 } from '@/src/shared/classes/epoc-v1';

declare const api: ApiInterface;

const { toObject, onNodesChange, nodes, edges, findNode }  = useVueFlow({ id: 'main' });
const projectStore = useProjectStore();

function writeProjectData(): void {
    debounceFunction(500, () => {
        const data = JSON.stringify(toObject());
        const content = JSON.stringify(createContentJSON());
        api.send('writeProjectData', data);
        api.send('writeEpocData', content);
    });
}

function importFile(filepath): Promise<string> {
    api.send('importFile', filepath);

    return new Promise((resolve) => {
        api.receiveOnce('fileImported', (data) => {
            resolve(data);
        });
    });
}

let timerId = null;

const debounceFunction = function (delay, cb) {
    clearTimeout(timerId);
    timerId = setTimeout(cb, delay);
};

onNodesChange(() => {
    writeProjectData();
});


function createContentJSON() : EpocV1 {

    const epocNode = nodes.value.find((node) => { return node.type === 'epoc'; });
    const chapterNodes = nodes.value.filter((node) => { return node.type === 'chapter'; });

    const ePocValues = epocNode.data.formValues;

    const epoc = new EpocV1(
        ePocValues.id || 'E000XX',
        ePocValues.title || 'Title',
        ePocValues.image || '',
        ePocValues.objectives || [],
        ePocValues.summary || '',
        ePocValues.teaser || '',
        ePocValues.thumbnail || '',
        ePocValues.version || new Date().getFullYear(),
        ePocValues.certificateScore || 0,
        ePocValues.authors || {},
        ePocValues.chapterParameter
    );

    console.log(epoc);

    chapterNodes.forEach(chapter => {
        console.log(chapter.data);
        const chapterValues = chapter.data.formValues;
        epoc.addChapter(chapter.data.contentId, {
            title: chapterValues.title || '',
            image: chapterValues.image || '',
            objectives: chapterValues.objectives || [],
            contents: []
        });
        let nextNode = getNextNode(chapter);
        while (nextNode) {
            console.log(nextNode.data);
            const chapterValues = chapter.data.formValues;
            epoc.addChapter(chapter.data.contentId, {
                title: chapterValues.title || '',
                image: chapterValues.image || '',
                objectives: chapterValues.objectives || [],
                contents: []
            });
            nextNode = getNextNode(nextNode);
        }
    });


    return epoc;
}

function getNextNode(node) {
    const edge = getConnectedEdges([node], edges.value).filter((edge) => edge.source === node.id)[0];
    return edge ? getNodeById(edge.target) : null;
}

function getNodeById(id) : GraphNode {
    return nodes.value.find((node) => { return node.id === id; });
}

export const projectService = {
    importFile,
    writeProjectData
};