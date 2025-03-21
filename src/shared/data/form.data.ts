import { Form } from '@/src/shared/interfaces';
import { elementForms, questionForms, nodeForms, badgeForms } from './forms';
import { computed, ComputedRef } from 'vue';

export const formsModel: ComputedRef<Form[]> = computed(() => [
    ...elementForms.value,
    ...questionForms.value,
    ...nodeForms.value,
    ...badgeForms.value,
]);
