import { standardActions } from '../data';
import { ApiInterface } from '../interfaces/api.interface';
import {
    addChapter,
    addContentToPage,
    addPage,
    deleteContent,
    deleteNode,
    deleteSelection,
    duplicatePage,
    graphCopy,
    graphPaste,
    insertAfter,
    insertAtEnd,
    insertAtStart,
    insertBefore, swapChapterWithNext, swapChapterWithPrevious, swapNodeWithNext, swapNodeWithPrevious,
    unselectAllContents,
    unselectAllNodes
} from './graph';
import { useVueFlow } from '@vue-flow/core';
import { saveState } from './undoRedo.service';

const { findNode } = useVueFlow({ id: 'main' });

declare const api: ApiInterface;

let initialized = false;

interface ExtendedApiInterface extends ApiInterface {
    beforeEachReceive: (channel: string) => void;
}

function beforeEachReceive() {
    saveState();
}

const extendedApi: ExtendedApiInterface = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    send: (channel: string, data?: any) => {
        api.send(channel, data);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    receive: (channel: string, callback: (...args: any[]) => void) => {
        api.receive(channel, (...args) => {
            // noinspection BadExpressionStatementJS
            beforeEachReceive; // Call beforeEachReceive before receiving data
            callback(...args);
        });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    receiveOnce: (channel: string, callback: (...args: any[]) => void) => {
        api.receiveOnce(channel, callback);
    },
    beforeEachReceive: beforeEachReceive,
};

export function setupContextMenu() {
    if (initialized) return;

    extendedApi.receive('addPage', (data: string) => {
        const parsedData: { type: string; position: { x: number; y: number } } = JSON.parse(data);
        const { type, position } = parsedData;

        const action = standardActions.find((a) => a.type === type);

        addPage(position, [action]);
    });

    extendedApi.receive('addChapter', () => {
        addChapter();
    });

    extendedApi.receive('deleteNode', (data: string) => {
        const parsedData: { id: string } = JSON.parse(data);
        const { id } = parsedData;

        deleteNode(id);
    });

    extendedApi.receive('duplicatePage', (data: string) => {
        const parsedData: { id: string } = JSON.parse(data);
        const { id } = parsedData;

        duplicatePage(id);
    });

    extendedApi.receive('addContent', (data: string) => {
        const parsedData: { type: string; id: string } = JSON.parse(data);
        const { type, id } = parsedData;

        const action = standardActions.find((a) => a.type === type);
        addContentToPage(id, action);
    });

    extendedApi.receive('deleteContent', (data: string) => {
        const parsedData: { pageId: string; id: string } = JSON.parse(data);
        const { pageId, id } = parsedData;

        deleteContent(pageId, id);
    });

    extendedApi.receive('insertAfter', (data: string) => {
        const parsedData: { id: string; type: string } = JSON.parse(data);
        const { id, type } = parsedData;

        const action = standardActions.find((a) => a.type === type);
        insertAfter(id, action);
    });

    extendedApi.receive('insertBefore', (data: string) => {
        const parsedData: { id: string; type: string } = JSON.parse(data);
        const { id, type } = parsedData;

        const action = standardActions.find((a) => a.type === type);
        insertBefore(id, action);
    });

    extendedApi.receive('insertAtEnd', (data: string) => {
        const parsedData: { id: string; type: string } = JSON.parse(data);
        const { id, type } = parsedData;

        const action = standardActions.find((a) => a.type === type);
        insertAtEnd(id, action);
    });

    extendedApi.receive('insertAtStart', (data: string) => {
        const parsedData: { id: string; type: string } = JSON.parse(data);
        const { id, type } = parsedData;

        const action = standardActions.find((a) => a.type === type);
        insertAtStart(id, action);
    });

    extendedApi.receive('deleteSelection', (data: string) => {
        const parsedData: { selection: string } = JSON.parse(data);
        const selection = JSON.parse(parsedData.selection);
        deleteSelection(selection);
    });

    api.receive('copySelection', (data: string) => {
        const parsedData: { selection: string } = JSON.parse(data);
        const selection = JSON.parse(parsedData.selection);

        graphCopy(selection);
    });

    api.receive('copy', (data: string) => {
        const parsedData: { id: string } = JSON.parse(data);
        const { id } = parsedData;

        const copiedNode = findNode(id);
        graphCopy([copiedNode]);
    });

    extendedApi.receive('paste', (data: string) => {
        const parsedData: { position: { x: number; y: number } } = JSON.parse(data);
        const { position } = parsedData;

        graphPaste(position);
    });
    
    extendedApi.receive('swapChapterWithNext', (data: string) => {
        const { id } = JSON.parse(data);
        
        swapChapterWithNext(id);
    });
    
    extendedApi.receive('swapChapterWithPrevious', (data: string) => {
        const { id } = JSON.parse(data);
        
        swapChapterWithPrevious(id);
    });
    
    extendedApi.receive('swapNodeWithNext', (data: string) => {
        const { id } = JSON.parse(data);
        
        swapNodeWithNext(id);
    });
    
    extendedApi.receive('swapNodeWithPrevious', (data: string) => {
        const { id } = JSON.parse(data);
        
        swapNodeWithPrevious(id);
    });

    api.receive('contextMenuClosed', () => {
        unselectAllContents();
        unselectAllNodes();
    });

    initialized = true;
}
