/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { app, BrowserWindow, protocol, session } = require('electron');
const { createMainWindow } = require('./components/main');
const { createSplashWindow } = require('./components/splash');
const { setupIpcListener } = require('./components/ipc');
const { waitEvent, waitAll, wait} = require('./components/utils');
const { cleanAllWorkdir } = require('./components/file');
const { cleanPreview } = require('./components/preview');
const path = require('path');
const store = require('./components/store');

const { popupMenu } = require('./components/contextMenu');

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
    mainWindow = createMainWindow();
    splashWindow = createSplashWindow();

    setupIpcListener(mainWindow);

    // Display splash screen for minimum 2s then display main window
    waitAll([
        waitEvent(mainWindow, 'ready-to-show'),
        wait(200)
    ]).then(async () => {
        splashWindow.destroy();
        mainWindow.show();
        if (filepath) {
            mainWindow.webContents.send('epocProjectPicked', JSON.stringify({name: null, modified: null, filepath: filepath, workdir: null}));
        }
    });

    // Intercept assets:// protocol to serve local files from workdir
    protocol.registerFileProtocol('assets', (request, callback) => {
        const workdir = store.state.currentProject.workdir;
        const filepath = request.url.substring(9);
        callback({path: path.join(workdir, filepath)});
    }, (err) => {
        if (err) console.error('Failed to register protocol');
    });

    // Intercept all url starting with assets/ and redirect it to custom protocol (wysiwyg/quill)
    const filter = {
        urls: ['*://*/assets/*', '*://*/images/*', '*://*/videos/*']
    };

    session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
        const assetsFolder = ['assets/', 'images/', 'videos/'].find(folder => details.url.includes(folder));
        if (mainWindow.webContents.id === details.webContents.id && assetsFolder) {
            const filepath = details.url.split(assetsFolder)[1];
            return callback({ redirectURL: `assets://${assetsFolder}${filepath}` });
        }
        callback({});
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

    mainWindow.webContents.on('context-menu', () => {
        popupMenu.popup(mainWindow.webContents);
    });
});