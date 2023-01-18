const { BrowserWindow } = require('electron');
const path = require('path');

/**
 * Create the splashscreen window
 * @returns {Electron.CrossProcessExports.BrowserWindow}
 */
module.exports.createSplashWindow = function () {
    const splashWindow = new BrowserWindow({
        width: 630,
        height: 400,
        frame: false,
        alwaysOnTop: true,
        resizable: false,
        transparent: true
    });

    splashWindow.loadFile(`${path.join(__dirname, '../../dist/splash.html')}`);
    splashWindow.center();
    return splashWindow
}