export type Content = 'text' | 'video' | 'audio'
export type Question = 'choice' | 'drag-and-drop' | 'reorder' | 'swipe' | 'dropdown-list'
export type Element = Content | Question

export interface TestNode {
    type: 'chapter' | 'page' | 'activity';
    index: number;
    contentType?: Content;
    activityType?: Question;
}
