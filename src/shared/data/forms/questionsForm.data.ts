import { Form } from '@/src/shared/interfaces';
import { contentButtons } from './formButtons.data';
import { i18n } from '@/src/i18n/config';

const { t } = i18n.global;

export const qcmForm: Form = {
    type: 'choice',
    name: t('questions.types.qcm'),
    icon: 'icon-qcm',
    displayFieldIndex: true,
    buttons: contentButtons,
    fields: [
        {
            name: t('questions.configuration'),
            inputs: [
                {
                    id: 'score',
                    type: 'score',
                    label: t('questions.score'),
                    value: 0,
                },
            ],
        },
        {
            name: t('questions.question'),
            inputs: [
                {
                    id: 'label',
                    type: 'textarea',
                    label: t('questions.question'),
                    value: '',
                    placeholder: t('questions.askQuestion'),
                },
                {
                    id: 'statement',
                    type: 'html-inline',
                    label: t('questions.instruction'),
                    value: '',
                    placeholder: t('questions.instructionPlaceholder'),
                },
            ],
        },
        {
            name: t('questions.responses'),
            inputs: [
                {
                    id: 'responses',
                    label: t('questions.response'),
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: 'label',
                            type: 'text',
                            label: t('questions.response'),
                            placeholder: t('questions.typeResponse'),
                            value: '',
                        },
                        {
                            id: 'value',
                            type: 'hidden',
                            label: '',
                            placeholder: t('forms.type'),
                            value: '',
                        },
                        {
                            id: 'feedback',
                            type: 'textarea',
                            label: t('questions.explanation'),
                            placeholder: t('questions.typeExplanation'),
                            value: '',
                            collapsible: true,
                            collapsibleLabel: t('questions.addExplanation'),
                        },
                        {
                            id: 'isCorrect',
                            type: 'checkbox',
                            label: t('questions.correctResponse'),
                            value: false,
                        },
                    ],
                },
            ],
        },
        {
            name: t('questions.explanation'),
            inputs: [
                {
                    id: 'explanation',
                    type: 'html',
                    label: '',
                    value: '',
                    placeholder: t('questions.typeExplanation'),
                },
            ],
        },
    ],
};

export const dragDropForm: Form = {
    type: 'drag-and-drop',
    name: t('questions.types.dragDrop'),
    icon: 'icon-dragdrop',
    displayFieldIndex: true,
    buttons: contentButtons,
    fields: [
        {
            name: t('questions.configuration'),
            inputs: [
                {
                    id: 'score',
                    type: 'score',
                    label: t('questions.score'),
                    value: 0,
                },
            ],
        },
        {
            name: t('questions.question'),
            inputs: [
                {
                    id: 'label',
                    type: 'textarea',
                    label: t('questions.question'),
                    value: '',
                    placeholder: t('questions.askQuestion'),
                },
                {
                    id: 'statement',
                    type: 'html-inline',
                    label: t('questions.instruction'),
                    value: '',
                    placeholder: t('questions.instructionPlaceholder'),
                },
            ],
        },
        {
            name: t('questions.categories'),
            inputs: [
                {
                    id: 'categories',
                    label: t('questions.category'),
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: '',
                            type: 'textarea',
                            label: '',
                            placeholder: t('questions.typeCategory'),
                            value: '',
                        },
                    ],
                },
            ],
        },
        {
            name: t('questions.proposedResponses'),
            inputs: [
                {
                    id: 'responses',
                    label: t('questions.response'),
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: 'label',
                            type: 'text',
                            label: t('questions.response'),
                            placeholder: t('questions.typeResponse'),
                            value: '',
                        },
                        {
                            id: 'value',
                            type: 'hidden',
                            label: '',
                            placeholder: t('forms.type'),
                            value: '',
                        },
                        {
                            id: 'feedback',
                            type: 'textarea',
                            label: t('questions.explanation'),
                            placeholder: t('questions.typeExplanation'),
                            value: '',
                            collapsible: true,
                            collapsibleLabel: t('questions.addExplanation'),
                        },
                        {
                            id: 'category',
                            type: 'select',
                            label: '',
                            placeholder: '',
                            value: '',
                            options: [],
                            linkedOptions: 'categories',
                        },
                    ],
                },
            ],
        },
        {
            name: t('questions.explanation'),
            inputs: [
                {
                    id: 'explanation',
                    type: 'html',
                    label: '',
                    value: '',
                    placeholder: t('questions.typeExplanation'),
                },
            ],
        },
    ],
};

export const reorderForm: Form = {
    type: 'reorder',
    name: t('questions.types.reorder'),
    icon: 'icon-reorder',
    displayFieldIndex: true,
    buttons: contentButtons,
    fields: [
        {
            name: t('questions.configuration'),
            inputs: [
                {
                    id: 'score',
                    type: 'score',
                    label: t('questions.score'),
                    value: 0,
                },
            ],
        },
        {
            name: t('questions.question'),
            inputs: [
                {
                    id: 'label',
                    type: 'textarea',
                    label: t('questions.question'),
                    value: '',
                    placeholder: t('questions.askQuestion'),
                },
                {
                    id: 'statement',
                    type: 'html-inline',
                    label: t('questions.instruction'),
                    value: '',
                    placeholder: t('questions.instructionPlaceholder'),
                },
            ],
        },
        {
            name: t('questions.responses'),
            inputs: [
                {
                    id: 'responses',
                    label: t('questions.response'),
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: 'label',
                            type: 'text',
                            label: t('questions.response'),
                            placeholder: t('questions.typeResponse'),
                            value: '',
                        },
                        {
                            id: 'feedback',
                            type: 'textarea',
                            label: t('questions.explanation'),
                            placeholder: t('questions.typeExplanation'),
                            value: '',
                            collapsible: true,
                            collapsibleLabel: t('questions.addExplanation'),
                        },
                        {
                            id: 'value',
                            type: 'hidden',
                            label: '',
                            placeholder: t('forms.type'),
                            value: '',
                        },
                    ],
                },
            ],
        },
        {
            name: t('questions.explanation'),
            inputs: [
                {
                    id: 'explanation',
                    type: 'html',
                    label: '',
                    value: '',
                    placeholder: t('questions.typeExplanation'),
                },
            ],
        },
    ],
};

export const swipeForm: Form = {
    type: 'swipe',
    name: t('questions.types.swipe'),
    icon: 'icon-swipe',
    displayFieldIndex: true,
    buttons: contentButtons,
    fields: [
        {
            name: t('questions.configuration'),
            inputs: [
                {
                    id: 'score',
                    type: 'score',
                    label: t('questions.score'),
                    value: 0,
                },
            ],
        },
        {
            name: t('questions.question'),
            inputs: [
                {
                    id: 'label',
                    type: 'textarea',
                    label: t('questions.question'),
                    value: '',
                    placeholder: t('questions.askQuestion'),
                },
                {
                    id: 'statement',
                    type: 'html-inline',
                    label: t('questions.instruction'),
                    value: '',
                    placeholder: t('questions.instructionPlaceholder'),
                },
            ],
        },
        {
            name: t('questions.proposedChoices'),
            inputs: [
                {
                    id: 'categories',
                    label: t('questions.choice'),
                    type: 'repeat',
                    value: ['Droite', 'Gauche'],
                    addButton: false,
                    inputs: [
                        {
                            id: '',
                            type: 'text',
                            label: '',
                            placeholder: t('questions.typeResponse'),
                            value: '',
                        },
                    ],
                },
            ],
        },
        {
            name: t('questions.proposedResponses'),
            inputs: [
                {
                    id: 'responses',
                    label: t('questions.card'),
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: 'label',
                            type: 'text',
                            label: t('questions.response'),
                            placeholder: t('questions.typeProposition'),
                            value: '',
                        },
                        {
                            id: 'feedback',
                            type: 'textarea',
                            label: t('questions.explanation'),
                            placeholder: t('questions.typeExplanation'),
                            value: '',
                            collapsible: true,
                            collapsibleLabel: t('questions.addExplanation'),
                        },
                        {
                            id: 'value',
                            type: 'hidden',
                            label: '',
                            placeholder: t('forms.type'),
                            value: '',
                        },
                        {
                            id: 'category',
                            type: 'select',
                            label: '',
                            placeholder: '',
                            value: '',
                            options: [],
                            linkedOptions: 'categories',
                        },
                    ],
                },
            ],
        },
        {
            name: t('questions.explanation'),
            inputs: [
                {
                    id: 'explanation',
                    type: 'html',
                    label: '',
                    value: '',
                    placeholder: t('questions.typeExplanation'),
                },
            ],
        },
    ],
};

export const listForm: Form = {
    type: 'dropdown-list',
    name: t('questions.types.dropdownList'),
    icon: 'icon-liste',
    displayFieldIndex: true,
    buttons: contentButtons,
    fields: [
        {
            name: t('questions.configuration'),
            inputs: [
                {
                    id: 'score',
                    type: 'score',
                    label: t('questions.score'),
                    value: 0,
                },
            ],
        },
        {
            name: t('questions.question'),
            inputs: [
                {
                    id: 'label',
                    type: 'textarea',
                    label: t('questions.question'),
                    value: '',
                    placeholder: t('questions.askQuestion'),
                },
                {
                    id: 'statement',
                    type: 'html-inline',
                    label: t('questions.instruction'),
                    value: '',
                    placeholder: t('questions.instructionPlaceholder'),
                },
            ],
        },
        {
            name: t('questions.proposedChoices'),
            inputs: [
                {
                    id: 'categories',
                    label: t('questions.choice'),
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: '',
                            type: 'text',
                            label: '',
                            placeholder: t('questions.typeResponse'),
                            value: '',
                        },
                    ],
                },
            ],
        },
        {
            name: t('questions.cards'),
            inputs: [
                {
                    id: 'responses',
                    label: t('questions.card'),
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: 'label',
                            type: 'text',
                            label: t('questions.response'),
                            placeholder: t('questions.typeProposition'),
                            value: '',
                        },
                        {
                            id: 'feedback',
                            type: 'textarea',
                            label: t('questions.explanation'),
                            placeholder: t('questions.typeExplanation'),
                            value: '',
                            collapsible: true,
                            collapsibleLabel: t('questions.addExplanation'),
                        },
                        {
                            id: 'value',
                            type: 'hidden',
                            label: '',
                            placeholder: t('forms.type'),
                            value: '',
                        },
                        {
                            id: 'category',
                            type: 'select',
                            label: '',
                            placeholder: '',
                            value: '',
                            options: [],
                            linkedOptions: 'categories',
                        },
                    ],
                },
            ],
        },
        {
            name: t('questions.explanation'),
            inputs: [
                {
                    id: 'explanation',
                    type: 'html',
                    label: '',
                    value: '',
                    placeholder: t('questions.typeExplanation'),
                },
            ],
        },
    ],
};

export const customQuestionForm: Form = {
    type: 'custom',
    name: t('questions.types.custom'),
    icon: 'icon-terminal',
    displayFieldIndex: true,
    buttons: contentButtons,
    fields: [
        {
            name: t('questions.configuration'),
            inputs: [
                {
                    id: 'score',
                    type: 'score',
                    label: t('questions.score'),
                    value: 0,
                },
            ],
        },
        {
            name: t('questions.question'),
            inputs: [
                {
                    id: 'label',
                    type: 'textarea',
                    label: t('questions.question'),
                    value: '',
                    placeholder: t('questions.askQuestion'),
                },
                {
                    id: 'statement',
                    type: 'html-inline',
                    label: t('questions.instruction'),
                    value: '',
                    placeholder: t('questions.instructionPlaceholder'),
                },
            ],
        },
        {
            name: t('questions.template.title'),
            inputs: [
                {
                    id: 'template',
                    type: 'select',
                    label: t('questions.template.select'),
                    value: '',
                    options: [],
                    linkedOptions: 'plugins.*.template',
                },
            ],
        },
        {
            name: t('questions.template.data'),
            inputs: [
                {
                    type: 'repeat',
                    id: 'data',
                    label: t('questions.template.data'),
                    value: [],
                    inputs: [
                        {
                            id: 'key',
                            type: 'text',
                            label: t('questions.template.key'),
                            placeholder: t('questions.template.key'),
                            value: '',
                        },
                        {
                            id: 'value',
                            type: 'textarea',
                            label: t('questions.template.value'),
                            placeholder: t('questions.template.value'),
                            value: '',
                        },
                    ],
                },
            ],
        },
        {
            name: t('questions.response'),
            inputs: [
                {
                    id: 'correctResponse',
                    label: t('questions.response'),
                    type: 'text',
                    value: '',
                },
            ],
        },
        {
            name: t('questions.explanation'),
            inputs: [
                {
                    id: 'explanation',
                    type: 'html',
                    label: '',
                    value: '',
                    placeholder: t('questions.typeExplanation'),
                },
            ],
        },
    ],
};

export const questionForms: Form[] = [qcmForm, swipeForm, reorderForm, dragDropForm, listForm, customQuestionForm];
