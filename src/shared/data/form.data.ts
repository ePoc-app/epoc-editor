import { Form } from '@/src/shared/interfaces';
import { elementForms, questionForms, nodeForms } from './forms';

export const formsModel: Form[] = [...elementForms, ...questionForms, ...nodeForms];