import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Create the splashscreen window
 * @returns {Electron.CrossProcessExports.BrowserWindow}
 */
export async function createSplashWindow() {
    const isDev = process.env.IS_DEV === 'true';
    const splashWindow = new BrowserWindow({
        width: 630,
        height: 400,
        frame: false,
        alwaysOnTop: true,
        resizable: false,
        transparent: true,
    });

    splashWindow.loadFile(
        isDev ?
            `${path.join(__dirname, '../../public/splash.html')}`
        :   `${path.join(__dirname, '../../dist/splash.html')}`,
    );
    splashWindow.center();

    const appInfo =
        isDev ?
            { version: app.getVersion(), buildNumber: 'dev' }
        :   (await import('../../dist/appInfo.json', { assert: { type: 'json' } })).default;

    splashWindow.webContents.executeJavaScript(`
        document.getElementById('appVersion').innerHTML = "v${appInfo.version}"
        document.getElementById('buildVersion').innerHTML = "(${appInfo.buildNumber})"
    `);

    return splashWindow;
}
