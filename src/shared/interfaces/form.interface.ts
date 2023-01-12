import { FormButton } from './formButton.interface';
import { Input } from './input.interface';

export interface Form {
    type: string;
    name: string;
    icon: string;
    inputs: Input[];
    buttons?: FormButton[];
}