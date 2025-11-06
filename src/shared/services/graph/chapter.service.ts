import { Node, useVueFlow } from '@vue-flow/core';
import { Chapter } from '@epoc/epoc-types/src/v1';
import { generateContentId, generateId, graphService } from '@/src/shared/services';
const { nodes, findNode, addNodes } = useVueFlow('main');

const MIN_DISTANCE = 128;
const DEFAULT_DISTANCE = 200;

/**
 * Get all chapters sorted by index
 */
export function getChapters() {
    return nodes.value.filter((node) => node.type === 'chapter').sort((a, b) => a.data.index - b.data.index);
}

/**
 * Add a new chapter to the graph
 * @param chapterId
 * @param chapter
 * @param offsetY
 * @returns {Node} - The new chapter
 */
export function addChapter(chapterId?: string, chapter?: Chapter, offsetY = 0): Node {
    const chapters = getChapters();
    const lastChapter = chapters[chapters.length - 1];

    const data = {
        action: { icon: 'icon-chapitre', type: 'chapter' },
        formType: 'chapter',
        formValues: {},
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

    const newYPos = lastChapter ? lastChapter.position.y + DEFAULT_DISTANCE + offsetY : DEFAULT_DISTANCE + offsetY;

    const newChapter: Node = {
        id: generateId(),
        type: 'chapter',
        position: { x: 0, y: newYPos },
        data,
        draggable: true,
        deletable: false,
        selectable: false,
    };
    addNodes(newChapter);

    return newChapter;
}

/**
 * Decrement the index of the chapters following the chapter with the given id
 * @param {string} chapterId
 */
export function updateNextChapters(chapterId: string): void {
    getNextChapters(chapterId).forEach((chapter) => chapter.data.index--);
}

/**
 * Get all the chapters preceding the given chapter & order them by index
 * @param {string} id
 */
export function getPreviousChapters(id: string) {
    const chapter = findNode(id);
    const chapters = getChapters();
    const currentIndex = chapter.data.index;

    return currentIndex > 1 ? chapters.slice(0, currentIndex - 1) : [];
}

/**
 * Get all the chapters following the given chapter & order them by index
 * @param {string} id
 */
export function getNextChapters(id: string) {
    const chapter = findNode(id);
    const chapters = getChapters();
    const currentIndex = chapter.data.index;

    return currentIndex < chapters.length ? chapters.slice(currentIndex) : [];
}

/**
 * Get the chapter just before the chapter with the given id
 * @param {string} id
 *
 */
export function getPreviousChapter(id: string) {
    const chapter = findNode(id);
    const chapters = getChapters();

    const previousIndex = chapter.data.index - 1;
    return previousIndex >= 0 ? chapters[previousIndex] : null;
}

export function getNextChapter(id: string) {
    const chapter = findNode(id);
    const chapters = getChapters();

    return chapters[chapter.data.index + 1] ?? null;
}

/**
 * Helper function used by swapChapterWithPrevious & swapChapterWithNext
 */
function swapChapters(chapter: Node, otherChapter: Node, isSwappingWithNext: boolean) {
    if (!otherChapter) return;

    const deltaY = otherChapter.position.y - chapter.position.y;
    moveChapterContents(chapter.id, deltaY);
    moveChapterContents(otherChapter.id, -deltaY);

    if (!isSwappingWithNext) {
        chapter.data.index++;
        otherChapter.data.index--;
    } else {
        chapter.data.index--;
        otherChapter.data.index++;
    }

    [chapter.position.y, otherChapter.position.y] = [otherChapter.position.y, chapter.position.y];
}

/**
 * Swap the chapter with the previous chapter
 * @param {string} id
 *
 */
export function swapChapterWithPrevious(id: string) {
    const chapter = findNode(id);
    const previousChapter = getPreviousChapter(id);
    swapChapters(chapter, previousChapter, false);
}

/**
 * Swap the chapter with the next chapter
 * @param id
 */
export function swapChapterWithNext(id: string) {
    const chapter = findNode(id);
    const nextChapter = getNextChapter(id);
    swapChapters(chapter, nextChapter, true);
}

/**
 * Manage the dragging of a chapter by keeping the others at the MIN_DISTANCE between each others
 * @param {string} id
 */
export function handleChapterDrag(id: string) {
    const chapter = findNode(id);
    const epocNode = findNode('1');

    const minY = epocNode.position.y + epocNode.dimensions.height + 32 + (chapter.data.index - 1) * MIN_DISTANCE;

    // Ensure the position of the dragged chapter is valid
    chapter.position.x = 0;
    chapter.position.y = Math.max(chapter.position.y, minY);

    const previousChapters = getPreviousChapters(id);
    const nextChapters = getNextChapters(id);

    const resetXPosition = (c: Node) => {
        c.position.x = 0;
    };

    // Push up previous chapters
    previousChapters.forEach((c, i) => {
        resetXPosition(c);
        const currentMinY = chapter.position.y - MIN_DISTANCE * (previousChapters.length - i);
        if (c.position.y > currentMinY) {
            c.position.y = currentMinY;
        }
    });

    // Push down next chapters
    nextChapters.forEach((c, i) => {
        resetXPosition(c);
        const maxY = chapter.position.y + MIN_DISTANCE * (i + 1);
        if (c.position.y < maxY) {
            c.position.y = maxY;
        }
    });
}

/**
 * Move the contents of the chapter by the given offset
 * @param chapterId
 * @param offsetY
 */
export function moveChapterContents(chapterId: string, offsetY: number) {
    let currentNode = findNode(chapterId);
    if (!currentNode) return;

    while (currentNode) {
        currentNode.position.y += offsetY;
        currentNode = graphService.getNextNode(currentNode);
    }
}

/**
 * Helper function used by insertChapterAfter & insertChapterBefore
 */
function shiftChapters(chapters: Node[], offsetY: number): void {
    for (const chapter of chapters) {
        chapter.position.y += offsetY;
        chapter.data.index++;
        moveChapterContents(chapter.id, offsetY);
    }
}

/**
 * Insert a new chapter before the chapter with the given id
 * @param {string} chapterId
 */
export function insertChapterBefore(chapterId: string): void {
    const chapter = findNode(chapterId);
    const newYPos = chapter.position.y;
    const newIndex = chapter.data.index;

    const chaptersToShift = [chapter, ...getNextChapters(chapterId)];
    shiftChapters(chaptersToShift, DEFAULT_DISTANCE);

    const newChapter = addChapter();
    newChapter.position.y = newYPos;
    newChapter.data.index = newIndex;

    addNodes(newChapter);
}

/**
 * Insert a new chapter after the chapter with the given id
 * @param {string} chapterId
 */
export function insertChapterAfter(chapterId: string): void {
    const chapter = findNode(chapterId);
    const newYPos = chapter.position.y + DEFAULT_DISTANCE;
    const newIndex = chapter.data.index + 1;

    const chaptersToShift = getNextChapters(chapterId);
    shiftChapters(chaptersToShift, DEFAULT_DISTANCE);

    const newChapter = addChapter();
    newChapter.position.y = newYPos;
    newChapter.data.index = newIndex;

    addNodes(newChapter);
}
