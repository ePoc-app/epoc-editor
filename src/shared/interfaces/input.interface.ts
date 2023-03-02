export interface Input {
    id: string;
    type: string;
    label: string;
    value: string;

    placeholder?: string;
    accept?: string;
    icon?: string;

    inputs?: Input[];
    addButton?: boolean;
}