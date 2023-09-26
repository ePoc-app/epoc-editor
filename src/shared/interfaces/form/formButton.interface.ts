export interface FormButton {
    label: string;
    icon: string;
    action: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    disabled?: boolean | ((n: any) => boolean);
}