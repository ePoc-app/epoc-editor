import { Field } from '.';

export interface Form {
    type: string;
    name: string;
    icon: string;
    fields: Field[];
    displayFieldIndex?: boolean;
}