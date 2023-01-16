export interface Input {
    type: string;
    label: string;
    value: string;

    placeholder?: string;
    accept?: string;
    icon?: string;
    question?: {
        pos: number;
        isLast?: boolean;
        type?: string;
    }
}