export interface FormButton {
    label: string;
    icon: string;
    action: string;

    disabled?: boolean | ((n) => boolean);
}