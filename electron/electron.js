/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { app, BrowserWindow, ipcMain } = require('electron');
const { createMainWindow, setupWindow, createNewWindow } = require('./components/window');
const { createSplashWindow } = require('./components/splash');
const { setupIpcListener } = require('./components/ipc');
const { waitEvent, waitAll, wait } = require('./components/utils');
const { cleanAllWorkdir } = require('./components/file');
const { cleanPreview } = require('./components/preview');
const path = require('path');
const { autoUpdater } = require('electron-updater');

const headless = process.argv.includes('--headless=true');

let mainWindow;
let splashWindow;
let filepath = process.argv[1] ? path.normalize(process.argv[1]) : null;

app.on('will-finish-launching', () => {
    app.on('open-file', async (event, path) => {
        event.preventDefault();
        filepath = path;

        if (mainWindow) {
            mainWindow.webContents.send(
                'epocProjectPicked',
                JSON.stringify({ name: null, modified: null, filepath: filepath, workdir: null }),
            );
        }
    });
});

autoUpdater.checkForUpdatesAndNotify();

// This method will be called when Electron has finished initialization and is ready to create browser windows.
app.whenReady().then(() => {
    mainWindow = createMainWindow();
    if (!headless) splashWindow = createSplashWindow();

    setupIpcListener(mainWindow);

    // Display splash screen for minimum 2s then display main window
    waitAll([waitEvent(mainWindow, 'ready-to-show'), wait(200)]).then(async () => {
        if (!headless) {
            splashWindow.destroy();
            mainWindow.show();
        }
    });

    setupWindow(mainWindow, filepath);

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) mainWindow = createMainWindow();
    });
    app.on('window-all-closed', () => {
        cleanAllWorkdir();
        cleanPreview();
        app.quit();
    });

    app.setAboutPanelOptions({
        credits: 'Logiciel distribué sous licence CeCILL-B.',
    });

    autoUpdater.on('update-downloaded', (e) => {
        console.log('Update ready');
        console.log(e);
    });
});

ipcMain.on('newWindow', () => {
    createNewWindow();
});
