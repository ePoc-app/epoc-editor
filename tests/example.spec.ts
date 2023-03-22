import { test, expect, ElectronApplication, Page } from '@playwright/test';

// test('has title', async ({ page }) => {
//     await page.goto('https://playwright.dev/');

//     // Expect a title "to contain" a substring.
//     await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//     await page.goto('https://playwright.dev/');

//     // Click the get started link.
//     await page.getByRole('link', { name: 'Get started' }).click();

//     // Expects the URL to contain intro.
//     await expect(page).toHaveURL(/.*intro/);
// });

const { _electron: electron } = require('playwright');

test('launch electron app', (async () => {
    // Launch Electron app.
    const electronApp = await electron.launch({ args: ['electron/electron.js'] });

    // Evaluation expression in the Electron context.
    const appPath = await electronApp.evaluate(async ({ app }) => {
        // This runs in the main Electron process, parameter here is always
        // the result of the require('electron') in the main app script.
        return app.getAppPath();
    });
    console.log(appPath);

    // Get the first window that the app opens, wait if necessary.
    const window = await electronApp.firstWindow();
    // Print the title.
    console.log(await window.title());

    const pages = await electronApp.context().pages();

    console.log('pages ', await pages);

    const landingPage = await pages[1];

    console.log('landing page:', await landingPage);

    // console.log(landingPage.getByText('Créer un nouveau projet'));

    // const windows = await electronApp.windows();

    // console.log('windows:', windows.length);

    // await landingPage.screenshot({ path: 'landingPage.png' });

    // setTimeout(async () => {
    //     const landingPage = await electronApp.firstWindow();
    //     const buttons = await landingPage.getByRole('button');
    //     console.log(buttons);
    // }, 5000);

    // const buttons = window.getByRole('button')
    // await window.getByRole('button', { name: 'Créer un nouveau projet' }).click();
    // await button.click();

    // await window.screenshot({ path: 'new_project.png' });
    // Capture a screenshot.
    // await window.screenshot({ path: 'intro.png' });
    // // Direct Electron console to Node terminal.
    // window.on('console', console.log);
    // // Click button.
    // await window.click('text=Click me');
    // // Exit app.
    // await electronApp.close();
}));