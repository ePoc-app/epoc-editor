import { Input, SideAction } from '.';

export interface Card {
    type: string;
    label: string;
    placeholder: string;
    inputs: Input[];
    
    action?: SideAction
}