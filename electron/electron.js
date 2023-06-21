/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { app, BrowserWindow } = require('electron');
const { createMainWindow, setupWindow } = require('./components/main');
const { createSplashWindow } = require('./components/splash');
const { setupIpcListener } = require('./components/ipc');
const { waitEvent, waitAll, wait} = require('./components/utils');
const { cleanAllWorkdir } = require('./components/file');
const { cleanPreview } = require('./components/preview');
const updater = require('update-electron-app');
const path = require('path');


let mainWindow;
let splashWindow;
// Open file with editor, on windows : using argv | on macOS using open-file event (see below)
let filepath = process.platform === 'win32' && process.argv[1] ? path.normalize(process.argv[1]) : null;

app.on('will-finish-launching', () => {
    app.on('open-file', async (event, path) => {
        event.preventDefault();
        filepath = path;

        if (mainWindow) {
            mainWindow.webContents.send('epocProjectPicked', JSON.stringify({name: null, modified: null, filepath: filepath, workdir: null}));
        }
    });
});

// This method will be called when Electron has finished initialization and is ready to create browser windows.
app.whenReady().then(() => {
    updater({repo: 'https://github.com/inrialearninglab/epoc-editor.git'});
    mainWindow = createMainWindow();
    splashWindow = createSplashWindow();

    setupIpcListener(mainWindow);

    // Display splash screen for minimum 2s then display main window
    waitAll([
        waitEvent(mainWindow, 'ready-to-show'),
        wait(2000)
    ]).then(async () => {
        splashWindow.destroy();
        mainWindow.show();
        if (filepath) {
            mainWindow.webContents.send('epocProjectPicked', JSON.stringify({name: null, modified: null, filepath: filepath, workdir: null}));
        }
    });

    setupWindow(mainWindow);

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) mainWindow = createMainWindow();
    });
    app.on('window-all-closed', () => {
        cleanAllWorkdir();
        cleanPreview();
        app.quit();
    });

    //? Context menu disabled for now
    // mainWindow.webContents.on('context-menu', () => {
    //     popupMenu.popup(mainWindow.webContents);
    // });
});
