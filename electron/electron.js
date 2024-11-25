/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { app, BrowserWindow, ipcMain } = require('electron');
const { createMainWindow, setupWindow } = require('./components/main');
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

// Triggered when opening a file & the app is already running
app.on('will-finish-launching', () => {
    app.on('open-file', async (event, path) => {
        event.preventDefault();
        filepath = path;

        // Focus window instead of creating a new one if already exists
        const allWindows = BrowserWindow.getAllWindows();
        const existingWindow = allWindows.find((window) => window.filepath === filepath);
        if(existingWindow) {
            existingWindow.focus();
            return;
        }

        createNewWindow().then((newWindow) => {
            if(newWindow.isDestroyed()) return;

            newWindow.webContents.once('did-finish-load', () => {
                newWindow.filepath = filepath;

                // did finish load should have all ipcListener correctly set up but doesn't work correctly so a timeout correctly wait long enough to set up eventListeners
                setTimeout(() => {
                    newWindow.webContents.send(
                        'epocProjectPicked',
                        JSON.stringify({ name: null, modified: null, filepath, workdir: null })
                    );
                }, 10);
            });
        });
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

    // Triggered when launching the app from a file
    mainWindow.webContents.on('did-finish-load', function() {
        if (filepath) {
            mainWindow.filepath = filepath;
            mainWindow.webContents.send(
                'epocProjectPicked',
                JSON.stringify({ name: null, modified: null, filepath, workdir: null })
            );
        }
    });

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

function createNewWindow() {
    const newWindow = createMainWindow();
    setupIpcListener(newWindow);
    setupWindow(newWindow);

    newWindow.on('ready-to-show', () => {
        newWindow.show();
    });

    return newWindow;
}

ipcMain.on('newWindow', () => {
    createNewWindow();
});