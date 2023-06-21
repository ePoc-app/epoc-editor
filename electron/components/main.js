const { BrowserWindow } = require('electron');
const path = require('path');
const { setupMenu } = require('./menu');
const store = require('./store');


/**
 * Create the app main window
 * @returns {Electron.CrossProcessExports.BrowserWindow}
 */
module.exports.createMainWindow = function () {
    const mainWindow = new BrowserWindow({
        show: false,
        icon: 'favicon.png',
        width: 1500,
        height: 1200,
        'minHeight': 400,
        'minWidth': 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            partition: `persist:${Math.random()}`
        },
    });

    mainWindow.on('focus', () => {
        setupMenu();
    });

    // load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }
    mainWindow.center();

    store.state.projects[mainWindow.id] = {};

    return mainWindow;
};

module.exports.setupWindow = function (window) {
    // Intercept assets:// protocol to serve local files from workdir
    try {
        window.webContents.session.protocol.registerFileProtocol('assets', (request, callback) => {
            const workdir = store.state.projects[window.id].workdir;
            const filepath = request.url.substring(9);
            callback({ path: path.join(workdir, filepath) });
        });
    } catch (error) {
        console.error('Failed to register protocol:', error);
    }

    // Intercept all url starting with assets/ and redirect it to custom protocol (wysiwyg/quill)
    const filter = MAIN_WINDOW_VITE_DEV_SERVER_URL ? {
        urls: [
            `${MAIN_WINDOW_VITE_DEV_SERVER_URL}/assets/*`,
            `${MAIN_WINDOW_VITE_DEV_SERVER_URL}/images/*`,
            `${MAIN_WINDOW_VITE_DEV_SERVER_URL}/videos/*`
        ]
    } : {
        urls: [
            `file://${encodeURI(path.join(__dirname, '../dist/assets/'))}*`,
            `file://${encodeURI(path.join(__dirname, '../dist/images/'))}*`,
            `file://${encodeURI(path.join(__dirname, '../dist/videos/'))}*`
        ]
    };

    window.webContents.session.webRequest.onBeforeRequest(filter, (details, callback) => {
        const assetsFolder = ['assets/', 'images/', 'videos/'].find(folder => details.url.includes(folder));
        const isAppFile = ['.js', '.css', '.html', '.ttf'].some(ext => details.url.includes(ext));
        if (window.webContents.id === details.webContents.id && !isAppFile && assetsFolder) {
            const filepath = details.url.split(assetsFolder)[1];
            return callback({ redirectURL: `assets://${assetsFolder}${filepath}` });
        }
        callback({});
    });
};
