import { NodeElement } from '@/src/shared/interfaces';

export interface RepeatInputEvent {
    type: string;
}

export interface RepeatAddEvent extends RepeatInputEvent {
    defaultValues: object | string;
}

export interface RepeatRemoveEvent extends RepeatInputEvent {
    index: number;
}

export interface RepeatMoveEvent extends RepeatInputEvent {
    oldIndex: number;
    newIndex: number;
}

export interface RepeatChangeEvent extends RepeatInputEvent {
    value: string | boolean | number | string[];
    id: string;
    index: number;
}

export interface DraggableChange {
    added?: {
        element: NodeElement;
        newIndex: number;
    };
    removed?: {
        element: NodeElement;
        oldIndex: number;
    };
    moved?: {
        element: NodeElement;
        oldIndex: number;
        newIndex: number;
    };
}
