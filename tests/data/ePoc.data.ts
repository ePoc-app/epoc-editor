import { TestNode } from '../types';

let chapterIndex = 0;
let pageIndex = 0;
let activityIndex = 0;

/*
    This array is used to create an ePoc within the tests.
    The nodes are placed following the order of the array, and connected to the previous node.
 */
export const ePoc: TestNode[] = [
    {
        type: 'chapter',
        index: ++chapterIndex
    },
    {
        type: 'page',
        index: ++pageIndex,
        contentType: 'text'
    },
    {
        type: 'page',
        index: ++pageIndex,
        contentType: 'video'
    },
    {
        type: 'activity',
        index: ++activityIndex,
        activityType: 'choice'
    },
    {
        type: 'chapter',
        index: ++chapterIndex,
    }
];
