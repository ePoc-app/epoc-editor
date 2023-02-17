const { dialog, BrowserWindow} = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const AdmZip = require('adm-zip')
const glob = require('glob');

/**
 * Open a dialog to choose a text file and return its content
 * @returns {string}
 */
module.exports.openFile = function () {
    const files = dialog.showOpenDialogSync(BrowserWindow.getFocusedWindow(), {
        properties: ['openFile'],
        filters: [{ name: 'Markdown', extensions: ['md', 'markdown', 'txt']}]
    });
    if(!files) return;

    const file = files[0];
    return fs.readFileSync(file).toString();
}

/**
 * Open a dialog to choose an ePoc file or project and return its content
 * @returns {string|null}
 */
module.exports.openEpocProject = function () {
    const files = dialog.showOpenDialogSync(BrowserWindow.getFocusedWindow(), {
        properties: ['openFile'],
        filters: [{ name: 'ePoc', extensions: ['epoc']}]
    });
    if(!files || !files[0]) return null;

    const file = files[0];
    const workdir = createWorkDir();

    const zip = new AdmZip(file, {});

    zip.extractAllTo(workdir, true, false, null);

    return file;
}

/**
 * Open a dialog to choose an ePoc file or project and return its content
 * @returns {string|null}
 */
module.exports.openEpocProject = function () {
    const files = dialog.showOpenDialogSync(BrowserWindow.getFocusedWindow(), {
        properties: ['openFile'],
        filters: [{ name: 'ePoc', extensions: ['epoc']}]
    });
    if(!files || !files[0]) return null;

    return files[0];
}

/**
 * Unzip the content of an ePoc project file to the project workdir
 * @returns {string|null}
 */
module.exports.unzipEpocProject = function (filepath) {
    if(!filepath) return null;
    const workdir = createWorkDir();

    const zip = new AdmZip(filepath, {});

    zip.extractAllTo(workdir, true, false, null);

    return JSON.stringify({filepath, workdir});
}

/**
 * Get the list of recently opened ePoc projects
 * @returns {string}
 */
module.exports.getRecentFiles = function () {
    //TODO: This solution surely won't work anymore with real data
    return fs.readFileSync(`${path.join(__dirname, '../../dist/epocs.json')}`).toString();
}

/**
 * Clean all workdir created
 */
module.exports.cleanAllWorkdir = function () {
    const workdirs = glob.sync(path.join(os.tmpdir(), 'epoc-editor-*'));

    workdirs.forEach(dir => {
        fs.rmSync(dir, {recursive: true, force: true})
    })
}

/**
 * Create a workdir to host currently open project files
 * @returns {string} workdir path
 */
createWorkDir = function () {
    return fs.mkdtempSync(path.join(os.tmpdir(), 'epoc-editor-'));
}