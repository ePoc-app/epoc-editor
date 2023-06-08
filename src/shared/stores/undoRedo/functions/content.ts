import { ContentChangedListAction, ContentMovedAction, ContentMutatedAction } from '@/src/shared/interfaces';
import { addContentToPage, changeContentOrder, removeContentFromPage } from '@/src/shared/services/graph';

export function addContentAction(action: ContentMutatedAction, reverseStack): void {
    const { pageId, content, index } = action;
    
    addContentToPage(pageId, content, index);
    
    const reverseAction: ContentMutatedAction = {
        ...action,
        type: 'contentAdded',
    };
    
    reverseStack.push(reverseAction);
}

export function removeContentAction(action: ContentMutatedAction, reverseStack): void {
    const { pageId, index} = action;
    
    removeContentFromPage(index, pageId);
    
    const reverseAction: ContentMutatedAction = {
        ...action,
        type: 'contentRemoved',
    };
    
    reverseStack.push(reverseAction);
}

export function moveContentAction(action: ContentMovedAction, reverseStack): void {
    const { pageId, oldIndex, newIndex }  = action;
    
    changeContentOrder(oldIndex, newIndex, pageId);

    const reverseAction: ContentMovedAction = {
        ...action,
        oldIndex: newIndex,
        newIndex: oldIndex,
    };
    reverseStack.push(reverseAction);
}

export function changeListAction(action: ContentChangedListAction, reverseStack): void {
    const { newPageId, oldPageId, oldIndex, newIndex, content }  = action;
    
    addContentToPage(oldPageId, content, oldIndex);
    removeContentFromPage(newIndex, newPageId, true);
    
    const reverseAction = {
        ...action,
        newPageId: oldPageId,
        oldPageId: newPageId, 
        oldIndex: newIndex,
        newIndex: oldIndex,
    };
    
    reverseStack.push(reverseAction);
}