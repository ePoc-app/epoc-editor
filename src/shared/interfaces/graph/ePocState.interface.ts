import { FlowExportObject } from '@vue-flow/core';

export interface ePocState {
    flow: FlowExportObject;
    form?: {
        elementId: string;
        formType: string;
        nodeId?: string;
        scrollPos?: number;
    };
}
