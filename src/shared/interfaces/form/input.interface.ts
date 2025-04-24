export interface Input {
    id: string;
    type:
        | 'file'
        | 'html'
        | 'repeat'
        | 'text'
        | 'score'
        | 'textarea'
        | 'hidden'
        | 'checkbox'
        | 'select'
        | 'html-text'
        | 'html-inline'
        | 'icon-picker'
        | 'badge-conditions'
        | 'radio-group'
        | 'badge';
    label: string;
    value: string | boolean | number | string[];
    placeholder?: string;
    accept?: string;
    icon?: string;
    inputs?: Input[];
    addButton?: boolean;
    options?: string[] | { value: string; label: string }[];
    linkedOptions?: string;
    targetDirectory?: string;
    hint?: string;
    collapsible?: boolean;
    collapsibleLabel?: string;
}
