import { TestForm } from '@/tests/types';

const choiceForm: TestForm = {
    type: 'choice',
    inputs: [
        {
            label: 'Score',
            value: '5',
            type: 'score',
        },
        {
            label: 'Question',
            value: 'Question test',
            type: 'textarea',
        },
        {
            label: 'Consigne',
            value: 'Consigne test',
            type: 'textarea',
        },
    ],
};

const dragAndDropForm: TestForm = {
    type: 'drag-and-drop',
    inputs: [
        {
            label: 'Score',
            value: '5',
            type: 'score',
        },
        {
            label: 'Question',
            value: 'Question test',
            type: 'textarea',
        },
        {
            label: 'Consigne',
            value: 'Consigne test',
            type: 'textarea',
        },
    ],
};

const reorderForm: TestForm = {
    type: 'reorder',
    inputs: [
        {
            label: 'Score',
            value: '5',
            type: 'score',
        },
        {
            label: 'Question',
            value: 'Question test',
            type: 'textarea',
        },
        {
            label: 'Consigne',
            value: 'Consigne test',
            type: 'textarea',
        },
    ],
};

const swipeForm: TestForm = {
    type: 'swipe',
    inputs: [
        {
            label: 'Score',
            value: '5',
            type: 'score',
        },
        {
            label: 'Question',
            value: 'Question test',
            type: 'textarea',
        },
        {
            label: 'Consigne',
            value: 'Consigne test',
            type: 'textarea',
        },
    ],
};

const dropdownListForm: TestForm = {
    type: 'dropdown-list',
    inputs: [
        {
            label: 'Score',
            value: '5',
            type: 'score',
        },
        {
            label: 'Question',
            value: 'Question test',
            type: 'textarea',
        },
        {
            label: 'Consigne',
            value: 'Consigne test',
            type: 'textarea',
        },
    ],
};

export const questionForms = [choiceForm, dragAndDropForm, reorderForm, swipeForm, dropdownListForm];
