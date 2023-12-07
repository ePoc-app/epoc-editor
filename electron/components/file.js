const { dialog, BrowserWindow, shell} = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const AdmZip = require('adm-zip');
const glob = require('glob');
const { wait } = require('./utils');
const Store = require('electron-store');
const store = new Store();

const recentFiles = store.get('recentFiles', []).filter((r) => {
    return fs.existsSync(r.filepath);
});

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
 * Open a dialog to choose an ePoc export archive to import
 * @returns {{filepath: null, workdir: string, name: null, modified: Date} | null}
 */
const pickEpocToImport = async function () {
    const startTime = performance.now();
    const files = dialog.showOpenDialogSync(BrowserWindow.getFocusedWindow(), {
        properties: ['openFile'],
        filters: [{name: 'ePoc export archive', extensions: ['zip']}]
    });
    if (!files || !files[0]) return null;
    const filepath = files[0];
    const workdir = createWorkDir();
    const zip = new AdmZip(filepath, {});
    zip.extractAllTo(workdir, true, false, null);

    let epoc;
    try {
        epoc = JSON.parse(fs.readFileSync(path.join(workdir, 'content.json'), 'utf8'));
    } catch (err) {
        return null;
    }

    const ellapsed = performance.now() - startTime;
    if (ellapsed < 500) await wait(500 - ellapsed);

    return {
        epoc,
        workdir
    };
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
    try {
        zip.extractAllTo(workdir, true, false, null);
    } catch (err) {
        return null;
    }

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

    updateRecent(project);

    return zipEpocProject(project.workdir, files);
};

/**
 * Zip files of an ePoc project
 * @param {string} workdir the path to the workdir
 * @param {string} filepath the path to the .epoc project file
 * @param {boolean} exporting if true, the project.json file will not be included
 */
const zipFiles = async function(workdir, filepath, exporting) {
    // Do not use path.join here, admZIP normalize the entries path
    const unusedAssets = getUnusedAssets(workdir).map(asset => 'assets/' + asset);

    const excluded = ['.DS_Store', '__MACOSX', '.git'];
    excluded.push(...unusedAssets);

    if(exporting) excluded.push('project.json');

    const zip = new AdmZip();
    zip.addLocalFolder(workdir, '', (entry) => {
        return excluded.every(e => entry.indexOf(e) === -1) ;
    });
    await zip.writeZipPromise(filepath, null);
};

/**
 * Zip the content of an ePoc project file from the project workdir
 * @returns {string}
 */
const zipEpocProject = async function (workdir, filepath) {
    if (!filepath || !workdir) return null;

    await zipFiles(workdir, filepath, false);

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

    await zipFiles(workdir, exportPath, true);
    shell.showItemInFolder(exportPath);

    return exportPath;
};

/**
 * Read the project data from the project.json file in workdir
 * @return string
 */
const readProjectData = async function (workdir) {
    try {
        return JSON.parse(fs.readFileSync(path.join(workdir, 'project.json'), 'utf8'));
    } catch (err) {
        return null;
    }
};

/**
 * Write the project data to the project.json file in workdir
 */
const writeProjectData = async function (workdir, data) {
    fs.writeFileSync(path.join(workdir, 'project.json'), data);
};

/**
 * Write the epoc data to the content.json file in workdir
 */
const writeEpocData = async function (workdir, data) {
    fs.writeFileSync(path.join(workdir, 'content.json'), data);
};

/**
 * Copy the imported file to the workdir
 * @param {string} workdir
 * @param {string} filepath
 * @param {boolean} isIcon
 * @return {string} the path of the copied file
 */
const copyFileToWorkdir = async function (workdir, filepath, isIcon) {
    const pathEnd = isIcon ? path.join('assets', 'icons') : 'assets';
    const assetsPath = path.join(workdir, pathEnd);

    if(!fs.existsSync(assetsPath)) fs.mkdirSync(assetsPath, {recursive: true});

    const copyPath = path.join(assetsPath, path.basename(filepath).replace(/[^a-z0-9.]/gi, '_'));
    if (!fs.existsSync(assetsPath)) fs.mkdirSync(assetsPath);
    fs.copyFileSync(filepath, copyPath);
    return path.relative(workdir, copyPath).replaceAll('\\', '/');
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

/**
 * Get all assets paths from the workdir
 * @param {string} workdir
 * @returns {string[]}
 */
const getAllAssets = function (workdir) {
    const assetsDir = path.join(workdir, 'assets');
    const iconsPath = path.join(assetsDir, 'icons');

    const assetPaths = [];

    try {
        const items = fs.readdirSync(assetsDir);

        for(const item of items) {
            const itemPath = path.join(assetsDir, item);
            const stat = fs.statSync(itemPath);

            if(stat.isFile()) assetPaths.push(itemPath);
        }

        const iconItems = fs.readdirSync(iconsPath);
        for(const item of iconItems) {
            const itemPath = path.join(iconsPath, item);
            const stat = fs.statSync(itemPath);

            if(stat.isFile()) assetPaths.push(itemPath);
        }

    } catch(e) {
        console.error('Error reading assets directory', e);
    }

    const assetsName = [];

    for(const asset of assetPaths) {
        const pathParts = asset.split(path.sep);
        const prefix = pathParts[pathParts.length - 2] === 'icons' ? `icons${path.sep}` : '';
        const filename = prefix + pathParts[pathParts.length - 1];
        assetsName.push(filename);
    }
    return assetsName;
};

const getUsedAssets = function (workdir) {
    const projectJSON = fs.readFileSync(path.join(workdir, 'project.json'), 'utf8');
    const regex = /"assets[\\/\\\\]([^"]+)"/g;
    const matches = projectJSON.match(regex);

    if(!matches) return [];
    return matches.map(match => {
        return match.replace('assets/', '')
            .replaceAll('"', '')
            // To only keep the slash after icons
            .replace(/\/+/g, '/')
            .replace(/\\/g, '');
    });
};

const getUnusedAssets = function (workdir) {
    const allAssets = getAllAssets(workdir);
    const usedAssets = getUsedAssets(workdir);

    const unusedAssets = [];
    for(const asset of allAssets) {
        if(!usedAssets.includes(asset)) {
            unusedAssets.push(asset);
        }
    }

    return unusedAssets;
};

module.exports = {
    getRecentFiles,
    openFile,
    newEpocProject,
    pickEpocToImport,
    pickEpocProject,
    openEpocProject,
    saveEpocProject,
    saveAsEpocProject,
    exportProject,
    writeProjectData,
    writeEpocData,
    readProjectData,
    copyFileToWorkdir,
    cleanAllWorkdir,
    getAllAssets,
};