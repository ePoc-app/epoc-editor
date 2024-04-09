import { Node, useVueFlow } from '@vue-flow/core';
import { Chapter } from '@epoc/epoc-types/src/v1';
import { generateContentId, graphService } from '@/src/shared/services';
const { nodes, findNode, addNodes } = useVueFlow({ id: 'main' });

/**
 * Add a new chapter to the graph
 * @param chapterId
 * @param chapter
 * @param offsetY
 * @returns {Node} - The new chapter
 */
export function addChapter(chapterId?: string, chapter?: Chapter, offsetY?: number): Node {
    const chapters = nodes.value.filter((node) => node.type === 'chapter');
    const data = {
        action: { icon: 'icon-chapitre', type: 'chapter' },
        formType: 'chapter',
        formValues: {},
        title: 'Chapitre ' + (chapters.length + 1),
        contentId: generateContentId(),
        index: chapters.length + 1,
    };
    if (chapterId && chapter) {
        data.contentId = chapterId;
        data.formValues = {
            title: chapter.title,
            objectives: chapter.objectives,
        };
    }
    offsetY = offsetY ? offsetY : 0;
    const newYPos = chapters.length > 0 ? chapters[chapters.length - 1].position.y + 200 + offsetY : 200 + offsetY;
    const newChapter: Node = {
        id: (nodes.value.length + 1).toString(),
        type: 'chapter',
        position: { x: 0, y: newYPos },
        data,
        draggable: true,
        deletable: false,
        selectable: false,
    };

    addNodes([newChapter]);

    return newChapter;
}

/**
 * Update the title of the chapters following the chapter with the given id to decrement their index
 * @param {string} chapterId
 */
export function updateNextChapters(chapterId: string): void {
    const nextChapters = getNextChapters(chapterId);
    
    for(const chapter of nextChapters) {
        chapter.data.index --;
    }
}

/**
 * Get all the chapters preceding the given chapter & order them by index
 * @param {string} id
 */
export function getPreviousChapters(id: string) {
    const chapter = findNode(id);
    const chapters = nodes.value.filter((node) => node.type === 'chapter');
    
    if(chapter.data.index === 1) return [];
    else return chapters.filter((c) => c.data.index < chapter.data.index).sort((a, b) => a.data.index - b.data.index);
}

/**
 * Get all the chapters following the given chapter & order them by index
 * @param {string} id
 */
export function getNextChapters(id: string) {
    const chapter = findNode(id);
    const chapters = nodes.value.filter((node) => node.type === 'chapter');
    
    if(chapter.data.index === chapters.length) return [];
    else return chapters.filter((c) => c.data.index > chapter.data.index).sort((a, b) => a.data.index - b.data.index);
}

/**
 * Get the chapter just before the chapter with the given id
 * @param {string} id
 *
 */
export function getPreviousChapter(id: string) {
    const chapter = findNode(id);
    const chapters = nodes.value.filter((node) => node.type === 'chapter');
    
    if(chapter.data.index === 1) return null;
    else return chapters.find((c) => c.data.index === chapter.data.index - 1);
}

export function getNextChapter(id: string) {
    const chapter = findNode(id);
    const chapters = nodes.value.filter((node) => node.type === 'chapter');
    
    if(chapter.data.index === chapters.length) return null;
    else return chapters.find((c) => c.data.index === chapter.data.index + 1);
}


/**
 * Swap the chapter with the previous chapter
 * @param {string} id
 *
 */
export function swapChapterWithPrevious(id: string) {
    const chapter = findNode(id);
    const previousChapter = getPreviousChapter(id);
    
    if(!previousChapter) return;
    
    moveChapterContents(chapter.id, previousChapter.position.y - chapter.position.y);
    moveChapterContents(previousChapter.id, chapter.position.y - previousChapter.position.y);
    
    chapter.data.index --;
    previousChapter.data.index ++;
    
    const tmpY = chapter.position.y;
    chapter.position.y = previousChapter.position.y;
    previousChapter.position.y = tmpY;
}

/**
 * Swap the chapter with the next chapter
 * @param id
 */
export function swapChapterWithNext(id: string) {
    const chapter = findNode(id);
    const nextChapter = getNextChapter(id);
    
    if(!nextChapter) return;
    
    moveChapterContents(chapter.id, nextChapter.position.y - chapter.position.y);
    moveChapterContents(nextChapter.id, chapter.position.y - nextChapter.position.y);
    
    chapter.data.index ++;
    nextChapter.data.index --;
    
    const tmpY = chapter.position.y;
    chapter.position.y = nextChapter.position.y;
    nextChapter.position.y = tmpY;
}


/**
 * Manage the dragging of a chapter by keeping the others at the MIN_DISTANCE between each others
 * @param {string} id
 */
export function handleChapterDrag(id: string) {
    const chapter = findNode(id);
    
    const MIN_DISTANCE = 128;
    const epocNode = findNode('1');
    const minY = epocNode.position.y + epocNode.dimensions.height + 32 + (chapter.data.index - 1) * MIN_DISTANCE;
    
    const previousChapters = getPreviousChapters(id);
    const nextChapters = getNextChapters(id);
    
    // Assuring the position of the chapter is valid
    if(chapter.position.x !== 0) chapter.position.x = 0;
    if (chapter.position.y < minY) chapter.position.y = minY;
    
    // Push up all the chapters after this chapter
    for(let i = 0; i < previousChapters.length; i++) {
        const c = previousChapters[i];
        
        if(c.position.x !== 0 ) c.position.x = 0;

        // Get the min distance for the current c
        const currentMinY = chapter.position.y - MIN_DISTANCE * (previousChapters.length - i);
        if(c.position.y > currentMinY) c.position.y = currentMinY;
    }
    
    // Push down all the chapters below this chapter
    for(let i = 0; i < nextChapters.length; i++) {
        const c = nextChapters[i];
        
        if(c.position.x !== 0 ) c.position.x = 0;
        
        // Get the max distance for the current c
        const maxY = chapter.position.y  + MIN_DISTANCE * (i + 1);
        if(c.position.y < maxY) c.position.y = maxY;
    }
}

/**
 * Move the contents of the chapter by the given offset
 * @param chapterId
 * @param offsetY
 */
export function moveChapterContents(chapterId: string, offsetY: number) {
    const chapter = findNode(chapterId);
    
    let nextNode = graphService.getNextNode(chapter);
    while(nextNode) {
        nextNode.position.y += offsetY;
        nextNode = graphService.getNextNode(nextNode);
    }
}