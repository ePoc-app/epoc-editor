import { TestForm } from '@/tests/types';

const choiceForm: TestForm = {
    type: 'choice',
    inputs: [
        {
            label: 'Score',
            value: '5',
            type: 'score'
        },
        {
            label: 'Question',
            value: 'Question test',
            type: 'textarea'
        },
        {
            label: 'Consigne',
            value: 'Consigne test',
            type: 'textarea'
        },
    ]
};

export const questionForms = [choiceForm];