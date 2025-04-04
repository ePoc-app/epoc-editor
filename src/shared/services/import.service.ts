import { EpocV1 } from '@/src/shared/classes/epoc-v1';
import {
    addChapter,
    createLinkedPage,
    getElementByContentId,
    setEpocNodeData,
    setPageContents,
} from '@/src/shared/services/graph';
import { generateId } from '@/src/shared/services/graph.service';
import { questions, standardPages } from '@/src/shared/data';
import { Assessment, ChoiceCondition, SimpleQuestion } from '@epoc/epoc-types/src/v1';
import { createRule, getConditions } from '@/src/shared/services/graph/badge.service';
import { Node } from '@vue-flow/core';
import { Badge } from '@/src/shared/interfaces';
import { router } from '@/src/router';
import { saveState } from '@/src/shared/services/undoRedo.service';
import { useEditorStore, useGraphStore } from '@/src/shared/stores';

const mapType = {
    video: standardPages.value.find((s) => s.type === 'video'),
    html: standardPages.value.find((s) => s.type === 'text'),
    audio: standardPages.value.find((s) => s.type === 'audio'),
    'multiple-choice': questions.value.find((s) => s.type === 'choice'),
    choice: questions.value.find((s) => s.type === 'choice'),
    'drag-and-drop': questions.value.find((s) => s.type === 'drag-and-drop'),
    'dropdown-list': questions.value.find((s) => s.type === 'dropdown-list'),
    swipe: questions.value.find((s) => s.type === 'swipe'),
    reorder: questions.value.find((s) => s.type === 'reorder'),
};

export function createGraphEpocFromData(epoc: EpocV1) {
    setEpocNodeData(epoc);
    let maxContentHeight = 0;
    for (const [chapterId, chapter] of Object.entries(epoc.chapters)) {
        let currentNode = addChapter(chapterId, chapter, maxContentHeight);
        maxContentHeight = 0;
        for (const contentId of chapter.contents) {
            let type: 'activity' | 'page' = 'page';
            const content = epoc.contents[contentId];
            const id = generateId();
            const action = {
                icon: '',
                type: '',
                label: '',
            };
            const contentElements = [];
            const contentElement = {
                id: generateId(),
                action: action,
                formType: mapType[content.type]?.type,
                formValues: {
                    ...content,
                },
                parentId: id,
                contentId,
            };
            const title = content.title;
            const subtitle = content.subtitle;
            const hidden = content.hidden;
            const conditional = content.conditional;
            const summary = (content as Assessment).summary;
            if (content.type === 'assessment') {
                type = 'activity';
                (content as Assessment).questions.forEach((qid) => {
                    const contentElement = newQuestion(epoc, id, qid);
                    contentElements.push(contentElement);
                });
            } else if (content.type === 'simple-question') {
                const qid = (content as SimpleQuestion).question;
                const contentElement = newQuestion(epoc, id, qid);
                contentElements.push(contentElement);
            } else if (content.type === 'choice') {
                const action = standardPages.value.find((s) => s.type === 'legacy-condition');
                const choiceResolver = (content as ChoiceCondition).conditionResolver;
                const contentElement = {
                    id: generateId(),
                    action,
                    formType: 'legacy-condition',
                    formValues: {
                        label: choiceResolver.label,
                        choices: choiceResolver.choices.map((c) => c.label),
                        conditionalFlag: choiceResolver.conditionalFlag.flatMap((cf) => {
                            return cf.flags.map((f) => {
                                return {
                                    id: f,
                                    choice: choiceResolver.choices.find((c) => c.value === cf.value).label,
                                };
                            });
                        }),
                    },
                    parentId: id,
                    contentId,
                };
                contentElements.push(contentElement);
            } else {
                contentElement.action.type = mapType[content.type].type;
                contentElement.action.icon = mapType[content.type].icon;
                contentElement.action.label = mapType[content.type].label;
                contentElements.push(contentElement);
            }
            currentNode = createLinkedPage(
                currentNode,
                type,
                contentElements,
                title,
                subtitle,
                id,
                hidden,
                conditional,
                contentId,
                summary,
            );
            const contentHeight = (contentElements.length - 1) * 60;
            maxContentHeight = contentHeight > maxContentHeight ? contentHeight : maxContentHeight;
        }
    }

    setPageContents();

    setBadgesData(epoc.badges);
}

// to translate v1 badges to v2
const contentVerbs = ['read', 'played', 'watched', 'listened'];
function setBadgesData(badges: Record<string, Badge>) {
    for (const badgeKey in badges) {
        const conditions = getConditions(badges[badgeKey]);
        conditions.forEach((condition, index) => {
            if (contentVerbs.includes(condition.verb)) {
                const node = getElementByContentId(condition.element) as Node;

                // only 1 element per page in v1
                const newElement = node.data.elements[0];

                // replace current condition element with newElement
                conditions[index].element = newElement.contentId;
            }
        });

        badges[badgeKey].rule = createRule(conditions);
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function newQuestion(epoc: any, id: string, qid: string) {
    const question = epoc.questions[qid];
    return {
        id: generateId(),
        action: {
            icon: mapType[question.type].icon,
            type: mapType[question.type].type,
            label: mapType[question.type].label,
        },
        formType: mapType[question.type].type,
        formValues: {
            ...setQuestionData(mapType[question.type].type, question),
        },
        parentId: id,
        contentId: qid,
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setQuestionData(type: string, question: any) {
    const questionData: {
        label: string;
        statement: string;
        explanation: string;
        score: number;
        responses: { label: string; value: string; category?: string; isCorrect?: boolean }[];
        categories?: string[];
    } = {
        label: question.label,
        statement: question.statement,
        explanation: question.explanation,
        score: question.score,
        responses: [],
    };

    if (type === 'choice') {
        questionData.responses = question.responses.map((r) => {
            return {
                ...r,
                isCorrect: question.correctResponse.includes(r.value),
            };
        });
    } else if (type === 'swipe' || type === 'drag-and-drop' || type === 'dropdown-list') {
        questionData.responses = question.responses.map((response) => {
            return {
                ...response,
                category: question.correctResponse.find((cat) => cat.values.includes(response.value)).label,
            };
        });
        questionData.categories = question.correctResponse.map((cat) => {
            return cat.label;
        });
    } else if (type === 'reorder') {
        questionData.responses = question.responses;
    }

    return questionData;
}

export function createGraphFromImport(importedEpoc) {
    const graphStore = useGraphStore();
    const editorStore = useEditorStore();

    graphStore.setFlow(null);
    router.push('/editor').then(() => {
        editorStore.loading = false;
        if (!importedEpoc || !importedEpoc.workdir) return;

        createGraphEpocFromData(importedEpoc.epoc);
        saveState();
    });
}
