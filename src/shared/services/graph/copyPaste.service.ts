import { ApiInterface } from '@/src/shared/interfaces/api.interface';
import { getSelectedNodes, alignNode } from '.';
import { useVueFlow, Node, GraphNode } from '@vue-flow/core';
import { generateId, generateContentId } from '../graph.service';
import { NodeElement } from '@/src/shared/interfaces';

const { addNodes } = useVueFlow({ id: 'main' });

declare const api: ApiInterface;

function setupCopyPaste(): void {
    api.receive('graphPasted', (data: string) => {
        const parsedData = JSON.parse(data);
        const { selectedPages, position } = parsedData;
        handleGraphPaste(selectedPages, position);
    });
}

setupCopyPaste();

export function graphCopy(selection?: Node[]): void {
    if(!selection) selection = getSelectedNodes();
    const selectedPages = selection.filter(node => node.type === 'page' || node.type === 'activity');
    
    const data = JSON.stringify({ pages: selectedPages });
    
    api.send('graphCopy', data);
}

export function graphPaste(position?: { x: number, y: number }) {
    const data = JSON.stringify({ position });
    api.send('graphPaste', data);
}

function handleGraphPaste(selectedPages: GraphNode[], position: { x: number, y: number }): void {
    if(!selectedPages) return;
    
    let offsetX: number;
    let offsetY: number;
    
    if(position) {
        offsetX = position.x - selectedPages[0].position.x;
        offsetY = position.y - selectedPages[0].position.y;
    } else {
        offsetX = 100;
        offsetY = 100;
    }

    const newPages = [];
    for(const page of selectedPages) {
        const pageId = generateId();
        
        const elements = page.data.elements.map((element: NodeElement)=> {
            const newElement = JSON.parse(JSON.stringify(element));
            newElement.id = generateId();
            newElement.parentId = pageId;
            newElement.contentId = generateContentId();
            return newElement;
        });

        const newPage: Node = {
            id: pageId,
            type: page.type,
            data: {
                type: page.data.type,
                elements,
                contentId: generateContentId(),
                formType: page.data.formType,
                formValues: JSON.parse(JSON.stringify(page.data.formValues)),
            },
            position: { x: page.position.x + offsetX, y: page.position.y + offsetY },
            deletable: true
        };
        newPages.push(newPage);
    }
    
    // deselect the old pages
    for(const page of selectedPages) {
        page.selected = false;
    }
    
    // select the new pages
    for(const page of newPages) {
        page.selected = true;
    }
    // automatically copy the new pages so that they can be pasted again without superposition
    // api.send('graphCopy', { selectedPages: newPages, selectionRectHeight: offsetY });

    addNodes(newPages);
    
    for(const page of newPages) {
        alignNode(page.id);
    }
}