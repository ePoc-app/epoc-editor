import { Field, FormButton } from '../index';

type ContentType = 'text' | 'html' | 'video' | 'audio' | 'condition' | 'legacy-condition';

export const QUESTION_TYPES = ['choice', 'drag-and-drop', 'reorder', 'swipe', 'dropdown-list', 'custom'] as const;
type QuestionType = (typeof QUESTION_TYPES)[number];

export interface Form {
    type: ContentType | QuestionType | 'chapter' | 'epoc' | 'page' | 'activity' | 'badge';
    name: string;
    icon: string;
    buttons: FormButton[];
    fields: Field[];
    displayFieldIndex?: boolean;
}
