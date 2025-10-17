const fs = require('fs');
const path = require('path');
const express = require('express');
const serveStatic = require('serve-static');
const AdmZip = require('adm-zip');
const { app, BrowserWindow, Menu, dialog } = require('electron');
const { t } = require('./utils');

const isDev = process.env.IS_DEV === 'true';
const resourcePath = isDev ? path.join(__dirname, '../../public') : process.resourcesPath;
const previewArchive = path.join(resourcePath, 'preview.zip');
const appDataPath = path.join(app.getPath('userData'));
const previewPath = path.join(appDataPath, 'preview');
const previewEpocPath = path.join(previewPath, 'assets', 'demo', 'epocs');
let previewInitialized = false;
let serverListener;
let previewWindow;

/**
 * Init preview files
 * @param {string} workdir
 * @param {string} ePocRootFolder - The path to the ePoc root folder
 * @param {string} ePocContentPath - The path to the ePoc content
 * @param {boolean} [global] - globalPreview
 */
async function runPreview(workdir, ePocRootFolder, ePocContentPath, global) {
    if (!previewInitialized) {
        if (!fs.existsSync(appDataPath)) {
            fs.mkdirSync(appDataPath);
        }

        if (!fs.existsSync(previewPath)) {
            fs.mkdirSync(previewPath);
        }

        const zip = new AdmZip(previewArchive);

        zip.extractAllTo(previewPath, true);
        fs.mkdirSync(previewEpocPath, { recursive: true });
        fs.symlinkSync(workdir, ePocRootFolder, 'junction');
        previewInitialized = true;
    } else {
        // Update preview files
        const zip = new AdmZip(previewArchive);
        zip.extractAllTo(previewPath, true);

        // Update symlink
        if (fs.existsSync(ePocRootFolder)) {
            fs.unlinkSync(ePocRootFolder);
        }
        fs.symlinkSync(workdir, ePocRootFolder, 'junction');
    }

    const server = await createPreviewServer();
    await createPreviewWindow(server, ePocContentPath, global);
}

/**
 * Create & run the global preview
 * @param {string} workdir
 */
async function createGlobalPreview(workdir) {
    const ePocRootName = path.basename(workdir);
    const ePocRootFolder = path.join(previewEpocPath, ePocRootName);
    const ePocContentPath = `epoc/preview/${ePocRootName}`;

    runPreview(workdir, ePocRootFolder, ePocContentPath, true);
}

/**
 * Create & run the preview
 * @param workdir
 * @param contentPath - The path to the ePoc content to preview
 */
async function createPreview(workdir, contentPath) {
    const ePocRootName = path.basename(workdir);
    const ePocRootFolder = path.join(previewEpocPath, ePocRootName);
    const ePocContentPath =
        contentPath ? `epoc/play/${ePocRootName}/${contentPath}` : `epoc/preview-editor/${ePocRootName}`;

    runPreview(workdir, ePocRootFolder, ePocContentPath);
}

/**
 * Lance un serveur pour la preview
 * @returns Promise
 */
function createPreviewServer() {
    return new Promise((resolve) => {
        if (serverListener) {
            resolve(serverListener);
            return;
        }
        const server = express();

        server.use(serveStatic(previewPath, { index: ['index.html', 'index.htm'] }));

        server.all('*', (req, res) => {
            res.status(200).sendFile(path.join(previewPath, 'index.html'));
        });

        serverListener = server.listen(0, function () {
            resolve(serverListener);
        });
    });
}

function updatePreview() {
    if (!previewWindow) return;

    previewWindow.reload();
}

/**
 * Create the preview window
 * @param {string} server - Preview server
 * @param {string} contentPath - ePoc content path
 * @param {boolean} [global] - Global preview
 * @returns Promise
 */
async function createPreviewWindow(server, contentPath, global) {
    if (!previewWindow) {
        previewWindow = new BrowserWindow({
            width: global ? 1500 : 375,
            height: global ? 1200 : 667,
            autoHideMenuBar: true,
            webPreferences: {
                devTools: true,
                nodeIntegration: true,
            },
            parent: BrowserWindow.getFocusedWindow(),
            fullscreenable: false,
        });

        previewWindow.webContents.on('did-finish-load', () => {
            previewWindow.webContents.insertCSS('body{ --ion-safe-area-top:0px; --ion-safe-area-bottom:0px; }');
        });

        previewWindow.on('closed', () => {
            previewWindow = null;
        });
    }

    previewWindow.on('focus', () => {
        setupMenuPreview();
    });

    await previewWindow.reload();
    await previewWindow.loadURL(`http://localhost:${server.address().port}/${contentPath}`);
    await previewWindow.focus();
}

/**
 * Clean all preview files
 */
const cleanPreview = function () {
    fs.rmSync(previewPath, { recursive: true, force: true });
};

/*
 * Fetch the current commit hash
 */
const getCommitHash = function () {
    return fs.readFileSync(path.join(previewPath, 'commit-hash.txt'), 'utf-8');
};

const setupMenuPreview = () => {
    const previewMenuTemplate = [
        {
            label: t('menu.app.label'),
            submenu: [
                { label: t('menu.app.about'), role: 'about' },
                {
                    label: t('menu.app.quit'),
                    accelerator: 'CmdOrCtrl+Q',
                    click: function () {
                        app.quit();
                    },
                },
            ],
        },
        {
            label: t('menu.preview.label'),
            submenu: [
                {
                    label: t('menu.reload'),
                    accelerator: 'CmdOrCtrl+R',
                    click: function () {
                        BrowserWindow.getFocusedWindow().webContents.reload();
                    },
                },
                {
                    label: t('menu.preview.menu.action'),
                    accelerator: 'CmdOrCtrl+P',
                    click: () => {
                        capturePreview();
                    },
                },
                {
                    label: t('menu.preview.menu.commit'),
                    click: function () {
                        const hash = getCommitHash();
                        if (!hash) return;

                        dialog.showMessageBox({
                            title: t('menu.preview.menu.commit'),
                            message: hash,
                            buttons: ['OK'],
                        });
                    },
                },
                {
                    label: t('menu.preview.menu.reset'),
                    click: function () {
                        BrowserWindow.getFocusedWindow().webContents.executeJavaScript(`
                          // Clear IndexedDB
                          indexedDB.deleteDatabase('__epocdb');
                          console.log('clear db');
                          location.reload();
                        `);
                    },
                },
                {
                    label: 'Dev Tools',
                    accelerator: 'CmdOrCtrl+D',
                    click: function () {
                        BrowserWindow.getFocusedWindow().webContents.toggleDevTools();
                    },
                },
            ],
        },
    ];
    const previewMenu = Menu.buildFromTemplate(previewMenuTemplate);
    Menu.setApplicationMenu(previewMenu);
};

/**
 * Export preview content as image
 */
const capturePreview = async () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (!focusedWindow) return;

    const session = focusedWindow.webContents.debugger;

    try {
        session.attach('1.3');
        await session.sendCommand('Page.enable');

        const { data } = await session.sendCommand('Page.captureScreenshot', {
            format: 'webp',
            quality: 100,
            captureBeyondViewport: true,
            fromSurface: true,
        });

        const downloadsPath = path.join(app.getPath('downloads'), 'preview.webp');
        fs.writeFileSync(downloadsPath, Buffer.from(data, 'base64'));

        dialog.showMessageBox(focusedWindow, {
            type: 'info',
            title: t('menu.preview.menu.success'),
            message: t('menu.preview.menu.detail'),
            detail: `${t('menu.preview.menu.savedTo')} ${downloadsPath}`,
            buttons: ['OK'],
        });
    } catch (e) {
        dialog.showErrorBox(t('menu.preview.menu.error'), e.message);
    } finally {
        session.detach();
    }
};

module.exports = {
    createPreview,
    createGlobalPreview,
    // runPreview,
    cleanPreview,
    updatePreview,
    getCommitHash,
};
