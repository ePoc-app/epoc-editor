const { BrowserWindow } = require('electron');
const path = require('path');

/**
 * Create the app main window
 * @returns {Electron.CrossProcessExports.BrowserWindow}
 */
module.exports.createMainWindow = function () {
    const isDev = process.env.IS_DEV === 'true';
    const mainWindow = new BrowserWindow({
        show: false,
        icon: 'favicon.png',
        width: 1500,
        height: 1200,
        'minHeight': 800,
        'minWidth': 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, '../preload.js')
        }
    });

    // load the index.html of the app.
    mainWindow.loadURL(
        isDev
            ? 'http://localhost:8000'
            : `file://${path.join(__dirname, '../../dist/index.html')}`
    ).then();
    mainWindow.center();
    return mainWindow;
};