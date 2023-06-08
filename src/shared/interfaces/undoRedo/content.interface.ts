import { NodeElement } from '../nodeElement.interface';
import { SideAction } from '../sideAction.interface';
import { UndoRedoAction } from './undoRedoAction.interface';

export interface ContentMutatedAction extends UndoRedoAction {
    type: 'contentAdded' | 'contentRemoved';
    pageId: string;
    content: SideAction | NodeElement;
    index: number;
}