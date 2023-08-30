import { Form } from '@/src/shared/interfaces';
import { elementForms, questionForms, nodeForms, badgeForms } from './forms';

export const formsModel: Form[] = [...elementForms, ...questionForms, ...nodeForms, ...badgeForms];