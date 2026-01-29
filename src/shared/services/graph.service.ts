import { ApiInterface } from '@/src/shared/interfaces/api.interface';
import { getConnectedEdges, GraphNode, useVueFlow } from '@vue-flow/core';
import { EpocV1 } from '@/src/shared/classes/epoc-v1';
import {
    Assessment,
    Audio,
    Choice,
    ChoiceCondition,
    Content,
    Html,
    SimpleQuestion,
    uid,
    Video,
} from '@epoc/epoc-types/dist/v1';
import { questions } from '@/src/shared/data';
import { useEditorStore } from '@/src/shared/stores';
import {
    deleteEmptyBadges,
    findContent,
    getContentIdFromId,
    getElementByContentId,
    setNodesSelectability,
} from '@/src/shared/services/graph';
import { Question } from '@epoc/epoc-types/src/v2';
import { createRule, getConditions, getValidBadges } from '@/src/shared/services';
import { Badge, NodeElement } from '@/src/shared/interfaces';
import { CustomQuestion } from '@epoc/epoc-types/dist/v2';
import { useSideBarStore } from '@/src/features/sideBar/stores/sideBarStore';

declare const api: ApiInterface;

const { nodes, edges, findNode, toObject } = useVueFlow('main');

function writeProjectData(): void {
    debounceFunction(500, () => {
        const { data, content } = getProjectJSON();
        api.send('writeProjectData', data);
        api.send('writeEpocData', content);
    });
}

function getProjectJSON(): { data: string; content: string } {
    const data = JSON.stringify(toObject());
    const content = JSON.stringify(createContentJSON());
    return { data, content };
}

function importFile(filepath: string, targetDirectory?: string): Promise<string> {
    api.send('importFile', { filepath, targetDirectory });

    return new Promise((resolve) => {
        api.receiveOnce('fileImported', (data) => {
            resolve(data);
        });
    });
}

let timerId = null;

const debounceFunction = function (delay: number, cb: () => void) {
    clearTimeout(timerId);
    timerId = setTimeout(cb, delay);
};

function createContentJSON(): EpocV1 {
    const editorStore = useEditorStore();

    const ePocNode = nodes.value.find((node) => {
        return node.type === 'epoc';
    });
    const chapterNodes = nodes.value.filter((node) => {
        return node.type === 'chapter';
    });
    const validBadges = getValidBadges();

    const ePocValues = ePocNode.data.formValues;
    const plugins = ePocValues.plugins ? ePocValues.plugins.map((plugin: any) => plugin.script) : [];

    const epoc = new EpocV1(
        ePocValues.id || 'E000XX',
        editorStore.version || 'NotFound',
        ePocValues.title || 'Title',
        ePocValues.image || '',
        ePocValues.objectives || [],
        ePocValues.summary || '',
        ePocValues.teaser || '',
        ePocValues.thumbnail || '',
        ePocValues.edition || new Date().getFullYear(),
        ePocValues.certificateDisabled || false,
        ePocValues.certificateScore || 10,
        ePocValues.certificateBadgeCount || 1,
        ePocValues.authors || {},
        plugins,
        ePocValues.chapterDuration,
        new Date().toISOString(),
        ePocValues.lang,
        {
            name: ePocValues.licenceName || '',
            url: ePocValues.licenceUrl || '',
            content: '',
        },
        undefined,
        ePocValues.tags,
    );

    const orderedChapters = chapterNodes.sort((a, b) => a.position.y - b.position.y);
    orderedChapters.forEach((chapter) => {
        const chapterValues = chapter.data.formValues;
        epoc.addChapter(chapter.data.contentId, {
            title: chapterValues.title || '',
            subtitle: chapterValues.subtitle || '',
            objectives: chapterValues.objectives || [],
            contents: [],
            duration: chapterValues.duration || 0,
            rule: chapterValues.rule,
        });
        let pageNode = getNextNode(chapter);
        while (pageNode) {
            const contentId = newContent(epoc, pageNode);
            epoc.chapters[chapter.data.contentId].contents.push(contentId);
            pageNode = getNextNode(pageNode);
        }
    });

    if (validBadges) {
        epoc.badges = exportBadgesToPage(validBadges);
    }

    return epoc;
}

function newContent(epoc: EpocV1, pageNode: GraphNode): string {
    const baseContent: Content = {
        type: 'unknown',
        title: pageNode.data.formValues.title || '',
        ...(pageNode.data.formValues.subtitle && { subtitle: pageNode.data.formValues.subtitle }),
        ...(pageNode.data.formValues.hidden && { hidden: pageNode.data.formValues.hidden }),
        ...(pageNode.data.formValues.conditional && { conditional: pageNode.data.formValues.conditional }),
    };

    if (pageNode.type === 'page') {
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
                rule: pageNode.data.formValues.rule,
            };
            return epoc.addContent(pageNode.data.contentId, content);
        } else if (contentNode.action.type === 'audio') {
            const content: Audio = {
                ...baseContent,
                type: 'audio',
                source: contentNode.formValues.source,
                summary: contentNode.formValues.summary,
                transcript: contentNode.formValues.transcript,
                rule: pageNode.data.formValues.rule,
            };
            return epoc.addContent(pageNode.data.contentId, content);
        } else if (contentNode.action.type === 'html' || contentNode.action.type === 'text') {
            const content: Html = {
                ...baseContent,
                type: 'html',
                html: contentNode.formValues.html,
                rule: pageNode.data.formValues.rule,
            };
            return epoc.addContent(pageNode.data.contentId, content);
        } else if (contentNode.action.type === 'legacy-condition') {
            const content: ChoiceCondition = {
                ...baseContent,
                type: 'choice',
                conditionResolver: {
                    type: 'choice',
                    label: contentNode.formValues.label,
                    choices: contentNode.formValues.choices.map((c: Choice) => {
                        return { label: c, value: c };
                    }),
                    conditionalFlag: contentNode.formValues.choices.map((c: Choice) => {
                        return {
                            value: c,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            flags: contentNode.formValues.conditionalFlag.reduce((arr: any, f: any) => {
                                if (f.choice === c) arr.push(f.id);
                                return arr;
                            }, []),
                        };
                    }),
                },
            };
            return epoc.addContent(pageNode.data.contentId, content);
        } else if (questions.value.some((q) => q.type === contentNode.action.type)) {
            const content: SimpleQuestion = {
                ...baseContent,
                type: 'simple-question',
                question: newQuestion(epoc, contentNode),
            };
            return epoc.addContent(pageNode.data.contentId, content);
        }
    } else if (pageNode.type === 'activity') {
        const questions = pageNode.data.elements.reduce((q: string[], questionNode: NodeElement) => {
            q.push(newQuestion(epoc, questionNode));
            return q;
        }, []);
        const content: Assessment = {
            ...baseContent,
            type: 'assessment',
            ...(pageNode.data.formValues.summary && { summary: pageNode.data.formValues.summary }),
            questions: questions,
            rule: pageNode.data.formValues.rule,
        };
        return epoc.addContent(pageNode.data.contentId, content);
    }
}

interface Response {
    label: string;
    value: string;
    feedback?: string;
}
//TODO: refactor this function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function newQuestion(epoc: EpocV1, questionNode: any): string {
    let type = 'unknown';
    let responses = [];
    let correctResponse = [];
    let template = '';

    //? Custom question don't save responses only correctResponse
    if (questionNode.formValues && (questionNode.formValues.responses || questionNode.formType === 'custom')) {
        if (questionNode.formType === 'choice') {
            responses = questionNode.formValues.responses.map((r: Response) => {
                const response: Response = {
                    label: r.label,
                    value: r.value,
                };

                if (r.feedback) {
                    response.feedback = r.feedback;
                }

                return response;
            });
            correctResponse = questionNode.formValues.responses.filter((r) => r.isCorrect).map((r) => r.value);
            type = correctResponse.length > 1 ? 'multiple-choice' : 'choice';
        } else if (questionNode.formType === 'reorder') {
            responses = questionNode.formValues.responses.map((r: Response) => {
                const response: Response = {
                    label: r.label,
                    value: r.value,
                };

                if (r.feedback) {
                    response.feedback = r.feedback;
                }

                return response;
            });
            correctResponse = questionNode.formValues.responses.reduce((acc, r) => acc + r.value, '');
            type = 'reorder';
        } else if (['drag-and-drop', 'dropdown-list', 'swipe'].includes(questionNode.formType)) {
            responses = questionNode.formValues.responses.map((r: Response) => {
                const response: Response = {
                    label: r.label,
                    value: r.value,
                };

                if (r.feedback) {
                    response.feedback = r.feedback;
                }

                return response;
            });
            correctResponse = questionNode.formValues.categories.map((cat) => {
                return {
                    label: cat,
                    values: questionNode.formValues.responses.filter((r) => r.category === cat).map((r) => r.value),
                };
            });
            type = questionNode.formType;
        } else if (questionNode.formType === 'custom') {
            //? responses need to contain values but we don't need them for custom questions
            responses = ['sample response'];

            correctResponse = questionNode.formValues.correctResponse;
            const path = questionNode.formValues.template.split('/');
            template = path[path.length - 1];

            type = 'custom';
        }
    }

    const question: Question = {
        type,
        label: questionNode.formValues?.label || '',
        statement: questionNode.formValues?.statement || '',
        score: questionNode.formValues?.score || 0,
        responses,
        correctResponse,
        feedback: questionNode.formValues?.explanation || '',
    };

    if (questionNode.formType === 'custom') {
        (question as CustomQuestion).template = template;
        (question as CustomQuestion).data = {};
        for (const value of questionNode.formValues.data) {
            (question as CustomQuestion).data[value.key] = value.value;
        }
    }

    return epoc.addQuestion(questionNode.contentId, question);
}

function getNextNode(node: GraphNode): GraphNode | null {
    const edge = getConnectedEdges([node], edges.value).filter((edge) => edge.source === node.id)[0];
    return edge ? getNodeById(edge.target) : null;
}

function getPreviousNode(node: GraphNode): GraphNode | null {
    const edge = getConnectedEdges([node], edges.value).filter((edge) => edge.target === node.id)[0];
    return edge ? getNodeById(edge.source) : null;
}

function getNodeById(id: string): GraphNode {
    return nodes.value.find((node) => {
        return node.id === id;
    });
}

interface contextDataProps {
    position?: { x: number; y: number };
    id?: string;
    pageId?: string;
    selection?: string;
}

function openContextMenu(context: string, data: contextDataProps): void {
    api.send('contextMenu', { context, ...data });
}

export const graphService = {
    importFile,
    writeProjectData,
    getPreviousNode,
    getNextNode,
    openContextMenu,
    getProjectJSON,
};

let openedConditionIndex: number | null = null;
export function enterSelectNodeMode(conditionIndex: number): void {
    const editorStore = useEditorStore();
    editorStore.enterSelectNodeMode();
    setNodesSelectability(true);

    disableGraph();
    openedConditionIndex = conditionIndex;
}

const contentsType = ['audio', 'video', 'text'];
function getConditionType(id: string): 'contents' | 'chapters' | 'pages' | 'questions' {
    const node = findNode(id);
    if (!node) {
        const nodeElement: NodeElement = findContent(id);
        if (contentsType.includes(nodeElement.action.type)) return 'contents';
        else return 'questions';
    } else {
        if (node.type === 'chapter') return 'chapters';
        if (node.type === 'activity') return 'contents';
        else return 'pages';
    }
}

export function exitSelectNodeMode(selectedId?: string): void {
    const editorStore = useEditorStore();
    editorStore.exitSelectNodeMode();
    setNodesSelectability(false);

    if (selectedId !== undefined) {
        if (openedConditionIndex) editorStore.resetTempCondition(openedConditionIndex);

        editorStore.tempConditions[openedConditionIndex].elementType = getConditionType(selectedId);
        editorStore.tempConditions[openedConditionIndex].element = getContentIdFromId(selectedId);
    }

    enableGraph();
    openedConditionIndex = null;
}

function disableGraph(): void {
    nodes.value.forEach((node) => (node.draggable = false));
    edges.value.forEach((edge) => {
        if (edge.id === 'mainEdge') return;

        edge.selectable = false;
        edge.deletable = false;
        edge.updatable = false;
    });
}

function enableGraph(): void {
    nodes.value.forEach((node) => {
        if (node.type === 'epoc') return;
        if (node.type === 'add') return;

        node.draggable = true;
    });
    edges.value.forEach((edge) => {
        if (edge.id === 'mainEdge') return;

        edge.selectable = true;
        edge.deletable = true;
        edge.updatable = true;
    });
}

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

// Used to translate v2 badges to v1
export function exportBadgesToPage(badges: Record<string, Badge>): Record<string, Badge> {
    const res = JSON.parse(JSON.stringify(badges));

    for (const badgeKey of Object.keys(res)) {
        let conditions = getConditions(res[badgeKey]);
        const elements = conditions.map((condition) => condition.element);

        for (const element of elements) {
            const nodeElement = getElementByContentId(element);

            // @ts-ignore
            if (nodeElement && nodeElement.parentId) {
                //@ts-ignore
                const parentNode = findNode(nodeElement.parentId);

                if (parentNode.type !== 'activity') {
                    const newElement = getContentIdFromId(parentNode.id);

                    conditions = conditions.map((condition) => {
                        if (condition.element === element) {
                            return {
                                ...condition,
                                element: newElement,
                            };
                        }
                        return condition;
                    });

                    res[badgeKey].rule = createRule(conditions);
                }
            }
        }
    }

    return res;
}

export function closeAllPanels() {
    const editorStore = useEditorStore();
    const sidebarStore = useSideBarStore();

    closeFormPanel();
    editorStore.dismissModals();
    sidebarStore.dismissModals();
}

export function closeFormPanel() {
    const editorStore = useEditorStore();

    if (editorStore.formPanel.form && editorStore.formPanel.form.type === 'badge' && !editorStore.selectNodeMode) {
        deleteEmptyBadges();
    }

    editorStore.closeFormPanel();
}
