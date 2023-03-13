import { ApiInterface } from '@/src/shared/interfaces/api.interface';
import { useProjectStore } from '../stores';
import { getConnectedEdges, GraphNode, useVueFlow } from '@vue-flow/core';
import { EpocV1 } from '@/src/shared/classes/epoc-v1';
import { Assessment, Content, Html, SimpleQuestion, Video } from '@epoc/epoc-specs/dist/v1';
import { Question } from '@epoc/epoc-specs/dist/v1/question';

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

    chapterNodes.forEach(chapter => {
        const chapterValues = chapter.data.formValues;
        epoc.addChapter(chapter.data.contentId, {
            title: chapterValues.title || '',
            image: chapterValues.image || '',
            objectives: chapterValues.objectives || [],
            contents: []
        });
        let screenNode = getNextNode(chapter);
        while (screenNode) {
            const contentId = newContent(epoc, screenNode);
            epoc.chapters[chapter.data.contentId].contents.push(contentId);
            screenNode = getNextNode(screenNode);
        }
    });


    return epoc;
}

function newContent(epoc: EpocV1, screenNode) : string {
    const baseContent: Content = {
        type: 'unknown',
        title: screenNode.data.formValues.title || '',
        subtitle: screenNode.data.formValues.subtitle || ''
    };
    if (screenNode.data.type === 'template') {
        const contentNode = screenNode.data.elements[0];
        if (contentNode.action.type === 'video') {
            const content: Video = {
                ...baseContent,
                type: 'video',
                poster: contentNode.formValues.poster,
                source: contentNode.formValues.source,
                subtitles: contentNode.formValues.subtitles,
                summary: contentNode.formValues.summary,
                transcript: contentNode.formValues.transcript,

            };
            return epoc.addContent(screenNode.data.contentId, content);
        } else if (contentNode.action.type === 'html' || contentNode.action.type === 'text') {
            const content: Html = {
                ...baseContent,
                type: 'html',
                html: contentNode.formValues.html
            };
            return epoc.addContent(screenNode.data.contentId, content);
        }
    } else {
        if (screenNode.data.elements.length > 1) {
            const questions = screenNode.data.elements.reduce((q, questionNode) => {
                q.push(newQuestion(epoc, questionNode));
                return q;
            }, []);
            const content: Assessment = {
                ...baseContent,
                type: 'assessment',
                summary: '',
                questions: questions
            };
            return epoc.addContent(screenNode.data.contentId, content);
        } else {
            const content: SimpleQuestion = {
                ...baseContent,
                type: 'simple-question',
                question: newQuestion(epoc, screenNode.data.elements[0])
            };
            return epoc.addContent(screenNode.data.contentId, content);
        }
    }
}

function newQuestion(epoc: EpocV1, questionNode) : string {
    // todo
    const question : Question = {
        type: '',
        label: '',
        statement: '',
        score: 0,
        responses: undefined,
        correctResponse: undefined,
        explanation: '',
    };
    return epoc.addQuestion(questionNode.contentId, question);
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