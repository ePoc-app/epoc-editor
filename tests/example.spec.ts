import { test } from '@playwright/test';
const { _electron: electron } = require('playwright');

import { sleep, addChapter, createLinkedNode } from './utils';

let electronApp;
let window;

test.describe('Create a new ePoc', () => {
    test.beforeAll(async () => {
        electronApp = await electron.launch({ args: ['electron/electron.js']});
        await sleep(2000);
        window = await electronApp.firstWindow();
    });

    test.afterAll(async () => {
        await electronApp.close();
    });

    test('Create a new project', (async () => {
        await window.getByText('Créer un nouveau projet').click();

        // await window.click('text=Créer un nouveau projet');
        await sleep(2000);
    }));

    test('Add a new chapter', (async () => {
        await addChapter(window);
        await sleep(2000);
    }));

    test('Drag & Drop a text node', (async () => {
        const chapterBox = await window.getByTestId('chapter-1').boundingBox();

        await createLinkedNode(window, 'text', chapterBox);
        await sleep(2000);
    }));
});