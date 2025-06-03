/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
import { app, BrowserWindow, ipcMain } from 'electron';
import { createMainWindow, setupWindow, createNewWindow, setupMenu } from './components/window.js';
import { createSplashWindow } from './components/splash.js';
import { setupIpcListener } from './components/ipc.js';
import { waitEvent, waitAll, wait } from './components/utils.js';
import { cleanAllWorkdir } from './components/file.js';
import { cleanPreview } from './components/preview.js';
import path from 'path';
import electronUpdater from 'electron-updater';

const { autoUpdater } = electronUpdater;

const headless = process.argv.includes('--headless=true');

let mainWindow;
let splashWindow;
let filepath = process.argv[1] ? path.normalize(process.argv[1]) : null;
let fileToOpen = null;

app.on('will-finish-launching', () => {
    app.on('open-file', async (event, path) => {
        event.preventDefault();
        filepath = path;

        if (mainWindow) {
            mainWindow.webContents.send(
                'epocProjectPicked',
                JSON.stringify({ name: null, modified: null, filepath: filepath, workdir: null }),
            );
        } else {
            fileToOpen = path;
        }
    });
});

autoUpdater.checkForUpdatesAndNotify();

// This method will be called when Electron has finished initialization and is ready to create browser windows.
app.whenReady().then(async () => {
    mainWindow = createMainWindow();
    if (!headless) splashWindow = await createSplashWindow();

    setupIpcListener(mainWindow, setupMenu);

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

    ipcMain.on('initialized', () => {
        mainWindow.webContents.send(
            'epocProjectPicked',
            JSON.stringify({ name: null, modified: null, filepath: fileToOpen, workdir: null }),
        );
    });
});

ipcMain.on('newWindow', () => {
    createNewWindow();
});
