import { Rule, uid } from '@epoc/epoc-types/src/v2';

export interface Badge {
    id?: uid;
    title: string;
    description: string;
    icon: string;
    rule: Rule
}

export interface Condition {
    element?: string;
    verb?: string;
    value?: string | number | boolean;
    elementType?: 'contents' | 'chapters' | 'pages' | 'questions';
}

export interface VerbDescription {
    label: string;
    valueType: 'number' | 'boolean' | 'string';
}

export type ElementType = 'chapter' | 'page' | 'html' | 'video' | 'audio' | 'activity' | 'question';
export type VerbKey = 'started' | 'completed' | 'viewed' | 'read' | 'played' | 'watched' | 'listened' | 'attempted' | 'scored' | 'passed';

export type Verbs = { [key in VerbKey]?: VerbDescription; }