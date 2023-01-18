/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { app, BrowserWindow } = require('electron');
const { createMainWindow } = require('./components/main');
const { createSplashWindow } = require('./components/splash');
const { setupIpcListener } = require('./components/ipc');
const { waitEvent, waitAll, wait} = require('./components/utils');
const { setupMenu } = require('./components/menu');

// This method will be called when Electron has finished initialization and is ready to create browser windows.
app.whenReady().then(() => {
    let mainWindow = createMainWindow();
    const splashWindow = createSplashWindow();

    setupIpcListener(mainWindow);

    setupMenu();

    // Display splash screen for minimum 2s then display main window
    waitAll([
        waitEvent(mainWindow, 'ready-to-show'),
        wait(2000)
    ]).then(() => {
        splashWindow.destroy();
        mainWindow.show();
    });

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) mainWindow = createMainWindow();
    });

    // Quit when all the window are closed, except on macOS. There, it's common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q.
    app.on('window-all-closed', () => {
        if(process.platform !== 'darwin') {
            app.quit();
        }
    });
});