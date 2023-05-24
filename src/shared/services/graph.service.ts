import { ApiInterface } from '@/src/shared/interfaces/api.interface';
import { getConnectedEdges, GraphNode, useVueFlow } from '@vue-flow/core';
import { EpocV1 } from '@/src/shared/classes/epoc-v1';
import {Assessment, ChoiceCondition, Content, Html, SimpleQuestion, uid, Video} from '@epoc/epoc-types/dist/v1';
import { Question } from '@epoc/epoc-types/dist/v1/question';
import { standardPages } from '@/src/shared/data';

declare const api: ApiInterface;

const { toObject, onNodesChange, nodes, edges }  = useVueFlow({ id: 'main' });

function writeProjectData(): void {
    debounceFunction(500, () => {
        const data = JSON.stringify(toObject());
        const content = JSON.stringify(createContentJSON());
        api.send('writeProjectData', data);
        api.send('writeEpocData', content);
    });
}

function importFile(filepath: string): Promise<string> {
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

    const ePocNode = nodes.value.find((node) => { return node.type === 'epoc'; });
    const chapterNodes = nodes.value.filter((node) => { return node.type === 'chapter'; });

    const ePocValues = ePocNode.data.formValues;

    const epoc = new EpocV1(
        ePocValues.id || 'E000XX',
        ePocValues.title || 'Title',
        ePocValues.image || '',
        ePocValues.objectives || [],
        ePocValues.summary || '',
        ePocValues.teaser || '',
        ePocValues.thumbnail || '',
        ePocValues.edition || new Date().getFullYear(),
        ePocValues.certificateScore || 0,
        ePocValues.authors || {},
        ePocValues.plugins,
        ePocValues.chapterParameter,
        new Date().toISOString()
    );

    chapterNodes.forEach(chapter => {
        const chapterValues = chapter.data.formValues;
        epoc.addChapter(chapter.data.contentId, {
            title: chapterValues.title || '',
            objectives: chapterValues.objectives || [],
            contents: []
        });
        let pageNode = getNextNode(chapter);
        while (pageNode) {
            const contentId = newContent(epoc, pageNode);
            epoc.chapters[chapter.data.contentId].contents.push(contentId);
            pageNode = getNextNode(pageNode);
        }
    });


    return epoc;
}

function newContent(epoc: EpocV1, pageNode: GraphNode) : string {
    const baseContent: Content = {
        type: 'unknown',
        title: pageNode.data.formValues.title || '',
        ...(pageNode.data.formValues.subtitle && { subtitle: pageNode.data.formValues.subtitle }),
        ...(pageNode.data.formValues.hidden && { hidden: pageNode.data.formValues.hidden }),
        ...(pageNode.data.formValues.conditional && { conditional: pageNode.data.formValues.conditional })
    };
    if (pageNode.data.elements.every(elem => standardPages.find(s => s.type === elem.formType))) {
        const contentNode = pageNode.data.elements[0];
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
            return epoc.addContent(pageNode.data.contentId, content);
        } else if (contentNode.action.type === 'html' || contentNode.action.type === 'text') {
            const content: Html = {
                ...baseContent,
                type: 'html',
                html: contentNode.formValues.html
            };
            return epoc.addContent(pageNode.data.contentId, content);
        } else if (contentNode.action.type === 'legacy-condition') {
            console.log(contentNode.formValues);
            const content: ChoiceCondition = {
                ...baseContent,
                type: 'choice',
                conditionResolver: {
                    type: 'choice',
                    label: contentNode.formValues.label,
                    choices: contentNode.formValues.choices.map(c => {
                        return {label: c, value: c};
                    }),
                    conditionalFlag: contentNode.formValues.choices.map(c => {
                        return {
                            value: c,
                            flags: contentNode.formValues.conditionalFlag.reduce((arr, f) => {
                                if (f.choice === c) arr.push(f.id);
                                return arr;
                            }, [])
                        };
                    })
                }
            };
            console.log(content.conditionResolver);
            return epoc.addContent(pageNode.data.contentId, content);
        }
        console.log(contentNode.action.type);
    } else {
        if (pageNode.data.elements.length > 1) {
            const questions = pageNode.data.elements.reduce((q, questionNode) => {
                q.push(newQuestion(epoc, questionNode));
                return q;
            }, []);
            const content: Assessment = {
                ...baseContent,
                type: 'assessment',
                summary: '',
                questions: questions
            };
            return epoc.addContent(pageNode.data.contentId, content);
        } else {
            const content: SimpleQuestion = {
                ...baseContent,
                type: 'simple-question',
                question: newQuestion(epoc, pageNode.data.elements[0])
            };
            return epoc.addContent(pageNode.data.contentId, content);
        }
    }
}

function newQuestion(epoc: EpocV1, questionNode) : string {
    let type = 'unknown';
    let responses = [];
    let correctResponse = [];

    if (questionNode.formValues && questionNode.formValues.responses) {
        if (questionNode.formType === 'choice') {
            responses = questionNode.formValues.responses.map(r => {
                return {
                    label: r.label,
                    value: r.value
                };
            });
            correctResponse = questionNode.formValues.responses.filter(r => r.isCorrect).map(r => r.value);
            type = correctResponse.length > 1 ? 'multiple-choice' : 'choice';
        } else if (questionNode.formType === 'reorder') {
            responses = questionNode.formValues.responses.map(r => {
                return {
                    label: r.label,
                    value: r.value
                };
            });
            correctResponse = questionNode.formValues.responses.reduce((acc, r) => acc+r.value, '');
            type = 'reorder';
        } else if (['drag-and-drop', 'dropdown-list', 'swipe'].includes(questionNode.formType)) {
            responses = questionNode.formValues.responses.map(r => {
                return {
                    label: r.label,
                    value: r.value
                };
            });
            correctResponse = questionNode.formValues.categories.map(cat => {
                return {
                    label: cat,
                    values: questionNode.formValues.responses.filter(r => r.category === cat).map(r => r.value)
                };
            });
            type = questionNode.formType;
        }
    }
    const question : Question = {
        type,
        label: questionNode.formValues?.label || '',
        statement: questionNode.formValues?.statement || '',
        score: questionNode.formValues?.score || 0,
        responses,
        correctResponse,
        explanation: questionNode.formValues?.explanation || '',
    };
    return epoc.addQuestion(questionNode.contentId, question);
}

function getNextNode(node): GraphNode | null {
    const edge = getConnectedEdges([node], edges.value).filter((edge) => edge.source === node.id)[0];
    return edge ? getNodeById(edge.target) : null;
}

function getPreviousNode(node): GraphNode | null {
    const edge = getConnectedEdges([node], edges.value).filter((edge) => edge.target === node.id)[0];
    return edge ? getNodeById(edge.source) : null;
}

function getNodeById(id: string) : GraphNode {
    return nodes.value.find((node) => { return node.id === id; });
}

export const graphService = {
    importFile,
    writeProjectData,
    getPreviousNode,
    getNextNode
};

export function generateContentId(): string {
    const firstNumber = (Math.random() * 46656) | 0;
    const secondNumber = (Math.random() * 46656) | 0;
    const firstPart = ('000' + firstNumber.toString(36)).slice(-3);
    const secondPart = ('000' + secondNumber.toString(36)).slice(-3);
    return firstPart + secondPart;
}

//generate id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
export function generateId(): uid {
    const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}