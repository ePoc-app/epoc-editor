import { SideAction } from './sideAction.interface';

export interface Screen {
    title: string;
    actions: SideAction[];
}