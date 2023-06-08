import { ContentMutatedAction } from '@/src/shared/interfaces';
import { addContentToPage, removeContentFromPage } from '@/src/shared/services/graph';

export function addContentAction(action: ContentMutatedAction, reverseStack): void {
    const { pageId, content, index } = action;
    
    
    addContentToPage(pageId, content, index);
    
    const reverseAction = {
        ...action,
        type: 'contentAdded',
    };
    
    reverseStack.push(reverseAction);
}

export function removeContentAction(action: ContentMutatedAction, reverseStack): void {
    const { pageId, index} = action;
    
    removeContentFromPage(index, pageId);
    
    const reverseAction = {
        ...action,
        type: 'contentRemoved',
    };
    
    reverseStack.push(reverseAction);
}