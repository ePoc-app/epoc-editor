import { TestForm } from '@/tests/types';

const textForm: TestForm = {
    type: 'text',
    inputs: [
        {
            label: 'Résumé',
            value: 'Résumé test',
            type: 'html'
        },
    ]
};

const videoForm: TestForm = {
    type: 'video',
    inputs: [
        {
            label: 'Résumé',
            value: 'Résumé test',
            type: 'html'
        }
    ]
};

export const contentForms = [textForm, videoForm];