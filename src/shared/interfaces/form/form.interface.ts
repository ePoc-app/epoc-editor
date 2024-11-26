import { Field, FormButton } from '../index';

type ContentType = 'text' | 'html' | 'video' | 'audio' | 'condition' | 'legacy-condition';
type QuestionType = 'choice' | 'drag-and-drop' | 'reorder' | 'swipe' | 'dropdown-list' | 'custom';

export interface Form {
    type: ContentType | QuestionType | 'chapter' | 'epoc' | 'page' | 'activity' | 'badge';
    name: string;
    icon: string;
    buttons: FormButton[];
    fields: Field[];
    displayFieldIndex?: boolean;
}
