const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = !!MAIN_WINDOW_VITE_DEV_SERVER_URL;
const appInfo = isDev ? {
    version: app.getVersion(),
    buildNumber: 'dev'
} : require('../../public/appInfo.json');

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

    splashWindow.loadFile(
        isDev
            ? `${path.join(__dirname, '../../public/splash.html')}`
            : `${path.join(__dirname, '../../dist/splash.html')}`
    );
    splashWindow.center();
    splashWindow.webContents.executeJavaScript(`
        document.getElementById('appVersion').innerHTML = "v${appInfo.version}"
        document.getElementById('buildVersion').innerHTML = "(${appInfo.buildNumber})"
    `);
    return splashWindow;
};
