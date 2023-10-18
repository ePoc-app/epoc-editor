export type PageContent = 'text' | 'video' | 'audio'
export type Question = 'choice' | 'drag-and-drop' | 'reorder' | 'swipe' | 'dropdown-list'
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

export interface TestForm {
    type: 'page' | 'epoc' | 'activity' | 'text' | 'audio' | 'video' | 'chapter' | 'choice';
    inputs: TestInput[];
}