import { Field, FormButton } from '../index';

export interface Form {
    type: string;
    name: string;
    icon: string;
    buttons: FormButton[];
    fields: Field[];
    displayFieldIndex?: boolean;
}