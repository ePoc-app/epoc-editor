import { SideAction } from '.';

export interface NodeElement {
    id: string;
    action: SideAction;
    formType: string;
    formValues: object;
    parentId?: string;
}