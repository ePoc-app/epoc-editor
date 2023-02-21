const { dialog, BrowserWindow} = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const AdmZip = require('adm-zip');
const glob = require('glob');
const { wait } = require('./utils');
const Store = require('electron-store');
const store = new Store();

const recentFiles = store.get('recentFiles', []);

/**
 * Get the list of recently opened ePoc projects
 * @returns {string}
 */
const getRecentFiles = function () {
    return recentFiles;
};

/**
 * Open a dialog to choose a text file and return its content
 * @returns {string}
 */
const openFile = function () {
    const files = dialog.showOpenDialogSync(BrowserWindow.getFocusedWindow(), {
        properties: ['openFile'],
        filters: [{ name: 'Markdown', extensions: ['md', 'markdown', 'txt']}]
    });
    if(!files) return;

    const file = files[0];
    return fs.readFileSync(file).toString();
};

/**
 * Open a dialog to choose an ePoc file or project and return its content
 * @returns {{filepath: string, workdir: null, name: null, modified: Date}}
 */
const newEpocProject = async function () {
    const startTime = performance.now();
    const project = {
        name: null,
        modified: new Date().toISOString(),
        filepath: null,
        workdir: createWorkDir()
    };

    const ellapsed = performance.now() - startTime;
    if (ellapsed < 500) await wait(500 - ellapsed);

    return project;
};

/**
 * Open a dialog to choose an ePoc file or project and return its content
 * @returns {{filepath: string, workdir: null, name: null, modified: Date}}
 */
const pickEpocProject = function () {
    const files = dialog.showOpenDialogSync(BrowserWindow.getFocusedWindow(), {
        properties: ['openFile'],
        filters: [{ name: 'ePoc', extensions: ['epoc']}]
    });
    if(!files || !files[0]) return null;

    return {
        name: null,
        modified: fs.statSync(files[0]).mtime,
        filepath: files[0],
        workdir: null
    };
};

/**
 * Unzip the content of an ePoc project file to the project workdir
 * @returns {{filepath: string, workdir: null, name: null, modified: Date}}
 */
const openEpocProject = async function (filepath) {
    if (!filepath) return null;
    const startTime = performance.now();
    const workdir = createWorkDir();
    const zip = new AdmZip(filepath, {});
    zip.extractAllTo(workdir, true, false, null);

    const project = {
        name: path.basename(filepath),
        modified: fs.statSync(filepath).mtime,
        filepath,
        workdir
    };

    updateRecent(project);

    const ellapsed = performance.now() - startTime;
    if (ellapsed < 500) await wait(500 - ellapsed);

    return project;
};

/**
 * Zip the content of an ePoc project file from the project workdir
 * @returns {boolean}
 */
const saveEpocProject = async function (workdir, filepath) {
    if (!filepath) return null;

    const zip = new AdmZip();
    glob.sync(path.join(workdir, '*'));
    zip.addLocalFolder(workdir, '/');
    await zip.writeZipPromise(filepath, null);
};

/**
 * Create a workdir to host currently open project files
 * @returns {string} workdir path
 */
const createWorkDir = function () {
    return fs.mkdtempSync(path.join(os.tmpdir(), 'epoc-editor-')).toString();
};

/**
 * Clean all workdir created
 */
const cleanAllWorkdir = function () {
    const workdirs = glob.sync(path.join(os.tmpdir(), 'epoc-editor-*'));

    workdirs.forEach(dir => {
        fs.rmSync(dir, {recursive: true, force: true});
    });
};

const updateRecent = function (project) {
    const recentIndex = recentFiles.findIndex(r => r.filepath === project.filepath);
    if (recentIndex !== -1) {
        recentFiles[recentIndex] = project;
        recentFiles.unshift(recentFiles.splice(recentIndex, 1)[0]);
    } else {
        recentFiles.unshift(project);
    }
    store.set('recentFiles', recentFiles);
};

module.exports = {
    getRecentFiles,
    openFile,
    newEpocProject,
    pickEpocProject,
    openEpocProject,
    saveEpocProject,
    cleanAllWorkdir
};