export interface Input {
    id: string;
    type: string;
    label: string;
    value: string | boolean | number | string[];
    placeholder?: string;
    accept?: string;
    icon?: string;
    inputs?: Input[];
    addButton?: boolean;
    options?: string[];
    linkedOptions?: string;
    targetDirectory?: string;
}
