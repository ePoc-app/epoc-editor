import { test } from '@playwright/test';
const { _electron: electron } = require('playwright');

import { sleep, addChapter, createLinkedNode, fillForm } from '@/tests/utils';
import { forms, nodes } from '@/tests/data';

let electronApp;
let window;

test.describe('Create a new ePoc', () => {
    test.beforeAll(async () => {
        electronApp = await electron.launch({ args: ['electron/electron.js']});
        await sleep(2000);
        window = await electronApp.firstWindow();
    });

    test.afterAll(async () => {
        await sleep(20000);
        await electronApp.close();
    });

    test('Create a new project', (async () => {
        await window.getByText('Créer un nouveau projet').click();

        // await window.click('text=Créer un nouveau projet');
        await sleep(2000);
    }));

    test.describe('Creating the graph', () => {
        for(let i = 0; i < nodes.length; i++) {
            test(`Add ${nodes[i].type} ${nodes[i].index}`, (async () => {
                if(nodes[i].type === 'chapter') {
                    await addChapter(window);
                } else {
                    await createLinkedNode(window, nodes[i - 1], nodes[i]);
                }
            }));
        }
    });

    test.describe('Filling forms', () => {
        test('Filling ePoc form', async () => {
            const epocForm = forms.find(form => form.type === 'epoc');
            await fillForm(window, epocForm, 'epoc-node');
        });
        
        for(const node of nodes) {
            test(`Filling ${node.type}-${node.index} form`, async () => {
                const testId = `${node.type}-${node.index}`;
                const form = forms.find(form => form.type === node.type);
                await fillForm(window, form, testId);
                
                if(node.type === 'page' || node.type === 'activity') {
                    for(const [index,content] of node.contents.entries()) {
                        const contentForm = forms.find(form => form.type === content.type);
                        await fillForm(window, contentForm, `${testId}-${index}`);
                    }
                }
            });
        }
    });
});