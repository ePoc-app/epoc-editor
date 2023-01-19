export interface Input {
    type: string;
    label: string;
    value: string;

    placeholder?: string;
    accept?: string;
    icon?: string;

    assessment?: {
        isChecked?: boolean;
        selectedOption?: string;
        // 1 == left radio, 2 == right radio, 0 == no radio
        selectedRadio?: number;
    }
}