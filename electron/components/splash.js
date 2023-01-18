const { app, BrowserWindow } = require('electron');
const path = require('path');

/**
 * Create the splashscreen window
 * @returns {Electron.CrossProcessExports.BrowserWindow}
 */
module.exports.createSplashWindow = function () {
    const isDev = process.env.IS_DEV === 'true';
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
    const appInfo = isDev ? {
        version: app.getVersion(),
        buildVersion: 'dev'
    } : require('../../dist/appInfo.json')
    splashWindow.webContents.executeJavaScript(`
        document.getElementById('appVersion').innerHTML = "v${appInfo.version}"
        document.getElementById('buildVersion').innerHTML = "(${appInfo.buildVersion})"
    `);
    return splashWindow
}