import { Input } from './input.interface';

export interface Field {
    name?: string;
    index?: number;
    type?: string;
    inputType?: string;
    inputs: Input[];
}