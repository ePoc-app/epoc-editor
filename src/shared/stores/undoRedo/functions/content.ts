import { ContentMovedAction, ContentMutatedAction } from '@/src/shared/interfaces';
import { addContentToPage, changeContentOrder, removeContentFromPage } from '@/src/shared/services/graph';

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

export function moveContentAction(action: ContentMovedAction, reverseStack): void {
    const { pageId, oldIndex, newIndex }  = action;
    
    changeContentOrder(oldIndex, newIndex, pageId);

    const reverseAction = {
        ...action,
        oldIndex: newIndex,
        newIndex: oldIndex,
    };
    reverseStack.push(reverseAction);
}