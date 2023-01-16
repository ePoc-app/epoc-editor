import { Input } from './input.interface';

export interface Field {
    name?: string;
    index?: number;
    inputs: Input[];
}