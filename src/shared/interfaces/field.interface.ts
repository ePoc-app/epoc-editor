import { Input, Card } from '.';

export interface Field {
    name?: string;
    index?: number;
    type?: string;
    inputType?: string;
    inputs: (Input | Card)[];
}