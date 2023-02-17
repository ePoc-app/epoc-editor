const { dialog, BrowserWindow} = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const AdmZip = require('adm-zip')
const glob = require('glob');
const {wait} = require('./utils');

/**
 * Get the list of recently opened ePoc projects
 * @returns {string}
 */
getRecentFiles = function () {
    //TODO: This solution surely won't work anymore with real data
    return fs.readFileSync(`${path.join(__dirname, '../../dist/epocs.json')}`).toString();
}

/**
 * Open a dialog to choose a text file and return its content
 * @returns {string}
 */
openFile = function () {
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
newEpocProject = async function () {
    const startTime = performance.now();
    const project = {
        filepath: null,
        workdir: createWorkDir()
    };

    const ellapsed = performance.now() - startTime;
    if (ellapsed < 500) await wait(500 - ellapsed);

    return project;
}

/**
 * Open a dialog to choose an ePoc file or project and return its content
 * @returns {string|null}
 */
openEpocProject = function () {
    const files = dialog.showOpenDialogSync(BrowserWindow.getFocusedWindow(), {
        properties: ['openFile'],
        filters: [{ name: 'ePoc', extensions: ['epoc']}]
    });
    if(!files || !files[0]) return null;

    return files[0];
}

/**
 * Unzip the content of an ePoc project file to the project workdir
 * @returns {{filepath, workdir: string}}
 */
unzipEpocProject = async function (filepath) {
    if (!filepath) return null;
    const startTime = performance.now();
    const workdir = createWorkDir();
    const zip = new AdmZip(filepath, {});
    zip.extractAllTo(workdir, true, false, null);

    const ellapsed = performance.now() - startTime;
    if (ellapsed < 500) await wait(500 - ellapsed);

    return {filepath, workdir};
}

/**
 * Create a workdir to host currently open project files
 * @returns {string} workdir path
 */
createWorkDir = function () {
    return fs.mkdtempSync(path.join(os.tmpdir(), 'epoc-editor-')).toString();
}

/**
 * Clean all workdir created
 */
cleanAllWorkdir = function () {
    const workdirs = glob.sync(path.join(os.tmpdir(), 'epoc-editor-*'));

    workdirs.forEach(dir => {
        fs.rmSync(dir, {recursive: true, force: true})
    })
}

module.exports = {
    getRecentFiles,
    openFile,
    newEpocProject,
    openEpocProject,
    unzipEpocProject,
    cleanAllWorkdir
}