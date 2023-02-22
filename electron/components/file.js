const { dialog, BrowserWindow, shell} = require('electron');
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
        modified: null,
        filepath: null,
        workdir: createWorkDir()
    };

    const ellapsed = performance.now() - startTime;
    if (ellapsed < 500) await wait(500 - ellapsed);

    return project;
};

/**
 * Open a dialog to choose an ePoc file or project and return its content
 * @returns {{filepath: string, workdir: null, name: null, modified: Date} | null}
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
 * Save the content of the ePoc project workdir to the currently opened .epoc file or call for saveAs
 * @returns {string}
 */
const saveEpocProject = async function (project) {
    if (!project.filepath) {
        return saveAsEpocProject(project);
    }

    return zipEpocProject(project.workdir, project.filepath);
};

/**
 * Save the content of the ePoc project workdir to a new .epoc file
 * @returns {string}
 */
const saveAsEpocProject = async function (project) {
    const files = dialog.showSaveDialogSync(BrowserWindow.getFocusedWindow(), {
        filters: [{ name: 'ePoc', extensions: ['epoc']}]
    });

    if(!files) return null;

    return zipEpocProject(project.workdir, files);
};

/**
 * Zip the content of an ePoc project file from the project workdir
 * @returns {string}
 */
const zipEpocProject = async function (workdir, filepath) {
    if (!filepath || !workdir) return null;

    const zip = new AdmZip();
    zip.addLocalFolder(workdir, '/', (entry) => {
        const excluded = ['.DS_Store', '__MACOSX', '.git'];
        return excluded.every(e => entry.indexOf(e) === -1) ;
    });
    await zip.writeZipPromise(filepath, null);
    return filepath;
};

/**
 * Export the content of an ePoc next to the .epoc file
 * @param {string} workdir the path to the workdir
 * @param {string} filepath the path to the .epoc project file
 * @return {string|null}
 */
const exportProject = async function (workdir, filepath) {
    const defaultPath = filepath ? path.join(path.dirname(filepath), path.basename(filepath, path.extname(filepath)) + '.zip') : '';

    const exportPath = dialog.showSaveDialogSync(BrowserWindow.getFocusedWindow(), {
        defaultPath: defaultPath,
        filters: [{ name: 'zip', extensions: ['zip']}]
    });

    if(!exportPath) return null;

    const zip = new AdmZip();
    zip.addLocalFolder(workdir, '/', (entry) => {
        const excluded = ['project.json','.DS_Store', '__MACOSX', '.git'];
        return excluded.every(e => entry.indexOf(e) === -1) ;
    });
    await zip.writeZipPromise(exportPath, null);
    shell.showItemInFolder(exportPath);
    return exportPath;
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
    saveAsEpocProject,
    exportProject,
    cleanAllWorkdir
};