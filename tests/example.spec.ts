import { test } from '@playwright/test';
const { _electron: electron } = require('playwright');

import { sleep, addChapter, createLinkedNode } from '@/tests/utils';
import { ePoc } from '@/tests/data';

let electronApp;
let window;

test.describe('Create a new ePoc', () => {
    test.beforeAll(async () => {
        electronApp = await electron.launch({ args: ['electron/electron.js']});
        await sleep(2000);
        window = await electronApp.firstWindow();
    });

    test.afterAll(async () => {
        await sleep(2000);
        await electronApp.close();
    });

    test('Create a new project', (async () => {
        await window.getByText('Créer un nouveau projet').click();

        // await window.click('text=Créer un nouveau projet');
        await sleep(2000);
    }));

    test.describe('Creating the graph', () => {
        for(let i = 0; i < ePoc.length; i++) {
            test(`Add ${ePoc[i].type} ${ePoc[i].index}`, (async () => {
                if(ePoc[i].type === 'chapter') {
                    await addChapter(window);
                } else {
                    await createLinkedNode(window, ePoc[i - 1], ePoc[i]);
                }
            }));
        }
    });
});