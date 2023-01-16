import { Field } from './field.interface';
import { FormButton } from './formButton.interface';
export interface Form {
    type: string;
    name: string;
    icon: string;
    fields: Field[];
    buttons?: FormButton[];
}