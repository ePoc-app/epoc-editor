import { Field, FormButton } from '.';

export interface Form {
    type: string;
    name: string;
    icon: string;
    fields: Field[];
    buttons?: FormButton[];
    displayFieldIndex?: boolean;
}