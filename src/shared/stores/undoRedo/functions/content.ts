import { addContentToPage, removeContentFromPage } from '@/src/shared/services/graph';

export function addContentAction(action, reverseStack): void {
    const { pageId, content, index } = action;
    
    addContentToPage(pageId, content, index);
    
    const reverseAction = {
        ...action,
        type: 'removeContent',
    };
    
    reverseStack.push(reverseAction);
}

export function removeContentAction(action, reverseStack): void {
    const { pageId, index} = action;

    removeContentFromPage(index, pageId);
    
    const reverseAction = {
        ...action,
        type: 'addContent',
    };
    
    reverseStack.push(reverseAction);
}