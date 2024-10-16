const fs = require('fs');
const path = require('path');
const express = require('express');
const serveStatic = require('serve-static');
const AdmZip = require('adm-zip');
const { app, BrowserWindow } = require('electron');

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
 */
async function runPreview(workdir, ePocRootFolder, ePocContentPath) {
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
    await createPreviewWindow(server, ePocContentPath);
}

/**
 * Create & run the global preview
 * @param {string} workdir
 */
async function createGlobalPreview(workdir) {
    const ePocRootName = path.basename(workdir);
    const ePocRootFolder = path.join(previewEpocPath, ePocRootName);
    const ePocContentPath = `epoc/preview/${ePocRootName}`;

    runPreview(workdir, ePocRootFolder, ePocContentPath);
}

/**
 * Create & run the preview
 * @param workdir
 * @param contentPath - The path to the ePoc content to preview
 */
async function createPreview(workdir, contentPath) {
    const ePocRootName = path.basename(workdir);
    const ePocRootFolder = path.join(previewEpocPath, ePocRootName);
    const ePocContentPath = contentPath
        ? `epoc/play/${ePocRootName}/${contentPath}`
        : `epoc/preview-editor/${ePocRootName}`;

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

async function createPreviewWindow(server, contentPath) {
    if (!previewWindow) {
        previewWindow = new BrowserWindow({
            width: 375,
            height: 667,
            autoHideMenuBar: true,
            webPreferences: {
                devTools: true,
                nodeIntegration: true,
            },
            parent: BrowserWindow.getFocusedWindow(),
            fullscreenable: false
        });

        previewWindow.webContents.on('did-finish-load', () => {
            previewWindow.webContents.insertCSS('body{ --ion-safe-area-top:0px; --ion-safe-area-bottom:0px; }');
        });

        previewWindow.on('closed', () => {
            previewWindow = null;
        });
    }

    previewWindow.on('focus', () => {
        const { setupMenuPreview } = require('./menu');
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

module.exports = {
    createPreview,
    createGlobalPreview,
    // runPreview,
    cleanPreview,
    updatePreview,
    getCommitHash
};
