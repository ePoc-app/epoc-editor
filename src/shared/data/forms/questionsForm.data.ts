import { Form } from '@/src/shared/interfaces';
import { contentButtons } from './formButtons.data';
import { i18n } from '@/i18n/config';
import { capitalizeFirstLetter } from '../../utils/string';
import { ComputedRef, computed } from 'vue';

export const qcmForm: ComputedRef<Form> = computed(() => ({
    type: 'choice',
    name: i18n.global.t('questions.types.qcm'),
    icon: 'icon-qcm',
    displayFieldIndex: true,
    buttons: contentButtons.value,
    fields: [
        {
            name: i18n.global.t('questions.configuration'),
            inputs: [
                {
                    id: 'score',
                    type: 'score',
                    label: i18n.global.t('questions.score'),
                    value: 0,
                },
            ],
        },
        {
            name: i18n.global.t('questions.question'),
            inputs: [
                {
                    id: 'label',
                    type: 'textarea',
                    label: i18n.global.t('questions.question'),
                    value: '',
                    placeholder: i18n.global.t('questions.askQuestion'),
                },
                {
                    id: 'statement',
                    type: 'html-inline',
                    label: i18n.global.t('questions.instruction'),
                    value: '',
                    placeholder: i18n.global.t('questions.instructionPlaceholder'),
                },
            ],
        },
        {
            name: i18n.global.t('questions.responses'),
            inputs: [
                {
                    id: 'responses',
                    label: i18n.global.t('questions.response'),
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: 'label',
                            type: 'text',
                            label: i18n.global.t('questions.response'),
                            placeholder: i18n.global.t('questions.typeResponse'),
                            value: '',
                        },
                        {
                            id: 'value',
                            type: 'hidden',
                            label: '',
                            placeholder: i18n.global.t('forms.type'),
                            value: '',
                        },
                        {
                            id: 'feedback',
                            type: 'textarea',
                            label: i18n.global.t('questions.explanation'),
                            placeholder: i18n.global.t('questions.typeExplanation'),
                            value: '',
                            collapsible: true,
                            collapsibleLabel: i18n.global.t('questions.addExplanation'),
                        },
                        {
                            id: 'isCorrect',
                            type: 'checkbox',
                            label: i18n.global.t('questions.correctResponse'),
                            value: false,
                        },
                    ],
                },
            ],
        },
        {
            name: i18n.global.t('questions.explanation'),
            inputs: [
                {
                    id: 'explanation',
                    type: 'html',
                    label: '',
                    value: '',
                    placeholder: i18n.global.t('questions.typeExplanation'),
                },
            ],
        },
    ],
}));

export const dragDropForm: ComputedRef<Form> = computed(() => ({
    type: 'drag-and-drop',
    name: i18n.global.t('questions.types.dragDrop'),
    icon: 'icon-dragdrop',
    displayFieldIndex: true,
    buttons: contentButtons.value,
    fields: [
        {
            name: i18n.global.t('questions.configuration'),
            inputs: [
                {
                    id: 'score',
                    type: 'score',
                    label: i18n.global.t('questions.score'),
                    value: 0,
                },
            ],
        },
        {
            name: i18n.global.t('questions.question'),
            inputs: [
                {
                    id: 'label',
                    type: 'textarea',
                    label: i18n.global.t('questions.question'),
                    value: '',
                    placeholder: i18n.global.t('questions.askQuestion'),
                },
                {
                    id: 'statement',
                    type: 'html-inline',
                    label: i18n.global.t('questions.instruction'),
                    value: '',
                    placeholder: i18n.global.t('questions.instructionPlaceholder'),
                },
            ],
        },
        {
            name: i18n.global.t('questions.categories'),
            inputs: [
                {
                    id: 'categories',
                    label: i18n.global.t('questions.category'),
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: '',
                            type: 'textarea',
                            label: '',
                            placeholder: i18n.global.t('questions.typeCategory'),
                            value: '',
                        },
                    ],
                },
            ],
        },
        {
            name: i18n.global.t('questions.proposedResponses'),
            inputs: [
                {
                    id: 'responses',
                    label: i18n.global.t('questions.response'),
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: 'label',
                            type: 'text',
                            label: i18n.global.t('questions.response'),
                            placeholder: i18n.global.t('questions.typeResponse'),
                            value: '',
                        },
                        {
                            id: 'value',
                            type: 'hidden',
                            label: '',
                            placeholder: i18n.global.t('forms.type'),
                            value: '',
                        },
                        {
                            id: 'feedback',
                            type: 'textarea',
                            label: i18n.global.t('questions.explanation'),
                            placeholder: i18n.global.t('questions.typeExplanation'),
                            value: '',
                            collapsible: true,
                            collapsibleLabel: i18n.global.t('questions.addExplanation'),
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
            name: i18n.global.t('questions.explanation'),
            inputs: [
                {
                    id: 'explanation',
                    type: 'html',
                    label: '',
                    value: '',
                    placeholder: i18n.global.t('questions.typeExplanation'),
                },
            ],
        },
    ],
}));

export const reorderForm: ComputedRef<Form> = computed(() => ({
    type: 'reorder',
    name: i18n.global.t('questions.types.reorder'),
    icon: 'icon-reorder',
    displayFieldIndex: true,
    buttons: contentButtons.value,
    fields: [
        {
            name: i18n.global.t('questions.configuration'),
            inputs: [
                {
                    id: 'score',
                    type: 'score',
                    label: i18n.global.t('questions.score'),
                    value: 0,
                },
            ],
        },
        {
            name: i18n.global.t('questions.question'),
            inputs: [
                {
                    id: 'label',
                    type: 'textarea',
                    label: i18n.global.t('questions.question'),
                    value: '',
                    placeholder: i18n.global.t('questions.askQuestion'),
                },
                {
                    id: 'statement',
                    type: 'html-inline',
                    label: i18n.global.t('questions.instruction'),
                    value: '',
                    placeholder: i18n.global.t('questions.instructionPlaceholder'),
                },
            ],
        },
        {
            name: i18n.global.t('questions.responses'),
            inputs: [
                {
                    id: 'responses',
                    label: i18n.global.t('questions.response'),
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: 'label',
                            type: 'text',
                            label: i18n.global.t('questions.response'),
                            placeholder: i18n.global.t('questions.typeResponse'),
                            value: '',
                        },
                        {
                            id: 'feedback',
                            type: 'textarea',
                            label: i18n.global.t('questions.explanation'),
                            placeholder: i18n.global.t('questions.typeExplanation'),
                            value: '',
                            collapsible: true,
                            collapsibleLabel: i18n.global.t('questions.addExplanation'),
                        },
                        {
                            id: 'value',
                            type: 'hidden',
                            label: '',
                            placeholder: i18n.global.t('forms.type'),
                            value: '',
                        },
                    ],
                },
            ],
        },
        {
            name: i18n.global.t('questions.explanation'),
            inputs: [
                {
                    id: 'explanation',
                    type: 'html',
                    label: '',
                    value: '',
                    placeholder: i18n.global.t('questions.typeExplanation'),
                },
            ],
        },
    ],
}));

export const swipeForm: ComputedRef<Form> = computed(() => ({
    type: 'swipe',
    name: i18n.global.t('questions.types.swipe'),
    icon: 'icon-swipe',
    displayFieldIndex: true,
    buttons: contentButtons.value,
    fields: [
        {
            name: i18n.global.t('questions.configuration'),
            inputs: [
                {
                    id: 'score',
                    type: 'score',
                    label: i18n.global.t('questions.score'),
                    value: 0,
                },
            ],
        },
        {
            name: i18n.global.t('questions.question'),
            inputs: [
                {
                    id: 'label',
                    type: 'textarea',
                    label: i18n.global.t('questions.question'),
                    value: '',
                    placeholder: i18n.global.t('questions.askQuestion'),
                },
                {
                    id: 'statement',
                    type: 'html-inline',
                    label: i18n.global.t('questions.instruction'),
                    value: '',
                    placeholder: i18n.global.t('questions.instructionPlaceholder'),
                },
            ],
        },
        {
            name: i18n.global.t('questions.proposedChoices'),
            inputs: [
                {
                    id: 'categories',
                    label: i18n.global.t('forms.node.choice'),
                    type: 'repeat',
                    value: [
                        capitalizeFirstLetter(i18n.global.t('global.right')),
                        capitalizeFirstLetter(i18n.global.t('global.left')),
                    ],
                    addButton: false,
                    inputs: [
                        {
                            id: '',
                            type: 'text',
                            label: '',
                            placeholder: i18n.global.t('questions.typeResponse'),
                            value: '',
                        },
                    ],
                },
            ],
        },
        {
            name: i18n.global.t('questions.proposedResponses'),
            inputs: [
                {
                    id: 'responses',
                    label: i18n.global.t('questions.card'),
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: 'label',
                            type: 'text',
                            label: i18n.global.t('questions.response'),
                            placeholder: i18n.global.t('questions.typeProposition'),
                            value: '',
                        },
                        {
                            id: 'feedback',
                            type: 'textarea',
                            label: i18n.global.t('questions.explanation'),
                            placeholder: i18n.global.t('questions.typeExplanation'),
                            value: '',
                            collapsible: true,
                            collapsibleLabel: i18n.global.t('questions.addExplanation'),
                        },
                        {
                            id: 'value',
                            type: 'hidden',
                            label: '',
                            placeholder: i18n.global.t('forms.type'),
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
            name: i18n.global.t('questions.explanation'),
            inputs: [
                {
                    id: 'explanation',
                    type: 'html',
                    label: '',
                    value: '',
                    placeholder: i18n.global.t('questions.typeExplanation'),
                },
            ],
        },
    ],
}));

export const listForm: ComputedRef<Form> = computed(() => ({
    type: 'dropdown-list',
    name: i18n.global.t('questions.types.dropdownList'),
    icon: 'icon-liste',
    displayFieldIndex: true,
    buttons: contentButtons.value,
    fields: [
        {
            name: i18n.global.t('questions.configuration'),
            inputs: [
                {
                    id: 'score',
                    type: 'score',
                    label: i18n.global.t('questions.score'),
                    value: 0,
                },
            ],
        },
        {
            name: i18n.global.t('questions.question'),
            inputs: [
                {
                    id: 'label',
                    type: 'textarea',
                    label: i18n.global.t('questions.question'),
                    value: '',
                    placeholder: i18n.global.t('questions.askQuestion'),
                },
                {
                    id: 'statement',
                    type: 'html-inline',
                    label: i18n.global.t('questions.instruction'),
                    value: '',
                    placeholder: i18n.global.t('questions.instructionPlaceholder'),
                },
            ],
        },
        {
            name: i18n.global.t('questions.proposedChoices'),
            inputs: [
                {
                    id: 'categories',
                    label: i18n.global.t('forms.node.choice'),
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: '',
                            type: 'text',
                            label: '',
                            placeholder: i18n.global.t('questions.typeResponse'),
                            value: '',
                        },
                    ],
                },
            ],
        },
        {
            name: i18n.global.t('questions.cards'),
            inputs: [
                {
                    id: 'responses',
                    label: i18n.global.t('questions.card'),
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: 'label',
                            type: 'text',
                            label: i18n.global.t('questions.response'),
                            placeholder: i18n.global.t('questions.typeProposition'),
                            value: '',
                        },
                        {
                            id: 'feedback',
                            type: 'textarea',
                            label: i18n.global.t('questions.explanation'),
                            placeholder: i18n.global.t('questions.typeExplanation'),
                            value: '',
                            collapsible: true,
                            collapsibleLabel: i18n.global.t('questions.addExplanation'),
                        },
                        {
                            id: 'value',
                            type: 'hidden',
                            label: '',
                            placeholder: i18n.global.t('forms.type'),
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
            name: i18n.global.t('questions.explanation'),
            inputs: [
                {
                    id: 'explanation',
                    type: 'html',
                    label: '',
                    value: '',
                    placeholder: i18n.global.t('questions.typeExplanation'),
                },
            ],
        },
    ],
}));

export const customQuestionForm: ComputedRef<Form> = computed(() => ({
    type: 'custom',
    name: i18n.global.t('questions.types.custom'),
    icon: 'icon-terminal',
    displayFieldIndex: true,
    buttons: contentButtons.value,
    fields: [
        {
            name: i18n.global.t('questions.configuration'),
            inputs: [
                {
                    id: 'score',
                    type: 'score',
                    label: i18n.global.t('questions.score'),
                    value: 0,
                },
            ],
        },
        {
            name: i18n.global.t('questions.question'),
            inputs: [
                {
                    id: 'label',
                    type: 'textarea',
                    label: i18n.global.t('questions.question'),
                    value: '',
                    placeholder: i18n.global.t('questions.askQuestion'),
                },
                {
                    id: 'statement',
                    type: 'html-inline',
                    label: i18n.global.t('questions.instruction'),
                    value: '',
                    placeholder: i18n.global.t('questions.instructionPlaceholder'),
                },
            ],
        },
        {
            name: i18n.global.t('questions.template.title'),
            inputs: [
                {
                    id: 'template',
                    type: 'select',
                    label: i18n.global.t('questions.template.select'),
                    value: '',
                    options: [],
                    linkedOptions: 'plugins.*.template',
                },
            ],
        },
        {
            name: i18n.global.t('questions.template.data'),
            inputs: [
                {
                    type: 'repeat',
                    id: 'data',
                    label: i18n.global.t('questions.template.data'),
                    value: [],
                    inputs: [
                        {
                            id: 'key',
                            type: 'text',
                            label: i18n.global.t('questions.template.key'),
                            placeholder: i18n.global.t('questions.template.key'),
                            value: '',
                        },
                        {
                            id: 'value',
                            type: 'textarea',
                            label: i18n.global.t('questions.template.value'),
                            placeholder: i18n.global.t('questions.template.value'),
                            value: '',
                        },
                    ],
                },
            ],
        },
        {
            name: i18n.global.t('questions.response'),
            inputs: [
                {
                    id: 'correctResponse',
                    label: i18n.global.t('questions.response'),
                    type: 'text',
                    value: '',
                },
            ],
        },
        {
            name: i18n.global.t('questions.explanation'),
            inputs: [
                {
                    id: 'explanation',
                    type: 'html',
                    label: '',
                    value: '',
                    placeholder: i18n.global.t('questions.typeExplanation'),
                },
            ],
        },
    ],
}));

export const questionForms: ComputedRef<Form[]> = computed(() => [
    qcmForm.value,
    swipeForm.value,
    reorderForm.value,
    dragDropForm.value,
    listForm.value,
    customQuestionForm.value,
]);
