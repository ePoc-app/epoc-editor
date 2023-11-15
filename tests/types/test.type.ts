export type PageContent = 'text' | 'video' | 'audio'

const questions = ['choice', 'drag-and-drop', 'reorder', 'swipe', 'dropdown-list'] as const;
export type Question = typeof questions[number];

export function isQuestion(value) {
    return questions.includes(value);
}

export type Content = PageContent | Question

export interface TestNode {
    type: 'chapter' | 'page' | 'activity';
    index: number;
    contents?: { type: Content }[];
}

export interface TestInput {
    label: string;
    value: string | boolean;
    type: 'text' | 'html' | 'checkbox' | 'score' | 'textarea';
}

interface TestRepeatCard {
    value: TestInput[];
}
export interface TestRepeatInput {
    id: string;
    type: 'repeat';
    cards: TestRepeatCard[];
}

export interface TestForm {
    type: 'page' | 'epoc' | 'activity' | 'text' | 'audio' | 'video' | 'chapter' | 'choice' | 'drag-and-drop' | 'reorder' | 'swipe' | 'dropdown-list';
    inputs: (TestInput | TestRepeatInput)[];
}