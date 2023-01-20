import { Input } from '.';

export interface Card {
    type: string;
    label: string;
    placeholder: string;
    inputs: Input[];
}