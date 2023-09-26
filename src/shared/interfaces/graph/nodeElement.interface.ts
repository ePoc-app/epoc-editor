import { SideAction } from '../index';

export interface NodeElement {
    id: string;
    action: SideAction;
    formType: string;
    formValues: object;
    parentId?: string;
    contentId?: string;
}