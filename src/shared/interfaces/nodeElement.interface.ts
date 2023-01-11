import { Form, SideAction } from '.';

export interface NodeElement {
    id: string;
    action: SideAction
    form: Form;
}