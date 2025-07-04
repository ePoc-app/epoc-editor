const { dialog, BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const AdmZip = require('adm-zip');
const glob = require('glob');
const { wait } = require('./utils');
const Store = require('electron-store');
const electronStore = new Store();
const store = require('./store');
const mime = require('mime-types');

const recentFiles = electronStore.get('recentFiles', []).filter((r) => {
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
        filters: [{ name: 'Markdown', extensions: ['md', 'markdown', 'txt'] }],
    });
    if (!files) return;

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
        workdir: createWorkDir(),
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
        filters: [{ name: 'ePoc export archive', extensions: ['zip', 'epoc'] }],
    });
    if (!files || !files[0]) return null;
    const filepath = files[0];

    const workdir = createWorkDir();
    return importEpoc(filepath, startTime, workdir);
};

/**
 * Import an ePoc project to the workdir
 * @param {string} filepath - the path to the ePoc
 * @param {number} startTime - the time when the import started
 * @param {string} workdir - the path to the workdir
 * @returns {{filepath: null, workdir: string, name: null, modified: Date} | null}
 */
const importEpoc = async function (filepath, startTime, workdir) {
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
        workdir,
    };
};

/**
 * Open a dialog to choose an ePoc file or project and return its content
 * @returns {{filepath: string, workdir: null, name: null, modified: Date} | null}
 */
const pickEpocProject = function () {
    const files = dialog.showOpenDialogSync(BrowserWindow.getFocusedWindow(), {
        properties: ['openFile'],
        filters: [{ name: 'ePoc', extensions: ['epocproject', 'epoc'] }],
    });
    if (!files || !files[0]) return null;

    return {
        name: null,
        modified: fs.statSync(files[0]).mtime,
        filepath: files[0],
        workdir: null,
    };
};

/**
 * Unzip the content of an ePoc project file to the project workdir
 * @returns {{project: {filepath: string, workdir: null, name: null, modified: Date} | null, import: boolean} | null}
 */
const openEpocProject = async function (filepath) {
    if (!filepath) return null;
    const startTime = performance.now();

    const workdir = createWorkDir();
    const zip = new AdmZip(filepath, {});
    try {
        zip.extractAllTo(workdir, true, false, null);
        if (!fs.existsSync(path.join(workdir, 'project.json'))) {
            const project = await importEpoc(filepath, startTime, workdir);
            store.updateState('projects', { [BrowserWindow.getFocusedWindow().id]: project });
            return {
                project,
                imported: true,
            };
        }
    } catch (err) {
        console.log('error', err);
        return null;
    }

    try {
        // if extenions is .epoc rename it to .epocproject
        if (path.extname(filepath) === '.epoc') {
            const newFilepath = filepath.replace('.epoc', '.epocproject');
            fs.renameSync(filepath, newFilepath);

            filepath = newFilepath;
        }

        const project = {
            name: path.basename(filepath),
            modified: fs.statSync(filepath).mtime,
            filepath,
            workdir,
        };

        updateRecent(project);

        const ellapsed = performance.now() - startTime;
        if (ellapsed < 500) await wait(500 - ellapsed);

        return {
            project,
            imported: false,
        };
    } catch (e) {
        return null;
    }
};

/**
 * Save the content of the ePoc project workdir to the currently opened .epocproject file or call for saveAs
 * @returns {string}
 */
const saveEpocProject = async function (project) {
    if (!project.filepath) {
        return saveAsEpocProject(project);
    }

    return zipEpocProject(project.workdir, project.filepath);
};

/**
 * Save the content of the ePoc project workdir to a new .epocproject file
 * @returns {string}
 */
const saveAsEpocProject = async function (project) {
    let filePath = dialog.showSaveDialogSync(BrowserWindow.getFocusedWindow(), {
        filters: [{ name: 'ePoc', extensions: ['epocproject'] }],
        defaultPath: project.name || 'Untitled.epocproject',
    });

    if (!filePath) return null;

    // Ensure the file has the correct extension
    if (path.extname(filePath).toLowerCase() !== '.epocproject') {
        filePath += '.epocproject';
    }

    project.filepath = filePath;
    updateRecent(project);

    return await zipEpocProject(project.workdir, filePath);
};

/**
 * Zip files of an ePoc project
 * @param {string} workdir the path to the workdir
 * @param {string} filepath the path to the .epocproject file
 * @param {boolean} exporting if true, the project.json file will not be included
 */
const zipFiles = async function (workdir, filepath, exporting) {
    // Do not use path.join here, admZIP normalize the entries path
    const unusedAssets = getUnusedAssets(workdir).map((asset) => 'assets/' + asset);

    const excluded = ['.DS_Store', '__MACOSX', '.git'];
    excluded.push(...unusedAssets);

    if (exporting) excluded.push('project.json');

    const zip = new AdmZip();
    zip.addLocalFolder(workdir, '', (entry) => {
        return excluded.every((e) => entry.replaceAll('\\', '/').indexOf(e) === -1);
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
 * Export the content of an ePoc next to the .epocproject file
 * @param {string} workdir the path to the workdir
 * @param {string} filepath the path to the .epocproject file
 * @return {string|null}
 */
const exportProject = async function (workdir, filepath) {
    const defaultPath =
        filepath ? path.join(path.dirname(filepath), path.basename(filepath, path.extname(filepath)) + '.epoc') : '';

    const exportPath = dialog.showSaveDialogSync(BrowserWindow.getFocusedWindow(), {
        defaultPath: defaultPath,
        filters: [{ name: 'epoc', extensions: ['epoc'] }],
    });

    if (!exportPath) return null;

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
 * @param {string} targetDirectory the path where to copy the file
 * @return {string} the path of the copied file
 */
const copyFileToWorkdir = async function (workdir, filepath, targetDirectory) {
    const pathEnd = targetDirectory ? path.join(...targetDirectory.split('/')) : 'assets';
    const assetsPath = path.join(workdir, pathEnd);

    if (!fs.existsSync(assetsPath)) fs.mkdirSync(assetsPath, { recursive: true });

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

    workdirs.forEach((dir) => {
        fs.rmSync(dir, { recursive: true, force: true });
    });
};

const updateRecent = function (project) {
    const recentIndex = recentFiles.findIndex((r) => r.filepath === project.filepath);
    if (recentIndex !== -1) {
        recentFiles[recentIndex] = project;
        recentFiles.unshift(recentFiles.splice(recentIndex, 1)[0]);
    } else {
        recentFiles.unshift(project);
    }
    electronStore.set('recentFiles', recentFiles);
};

/**
 * Get all assets paths from the workdir
 * @param {string} workdir
 * @returns {string[]}
 */
const getAllAssets = function (workdir) {
    const assetsDir = path.join(workdir, 'assets');
    const iconsPath = path.join(assetsDir, 'icons');

    if (!fs.existsSync(assetsDir)) return [];

    const assetPaths = [];

    try {
        const items = fs.readdirSync(assetsDir);

        for (const item of items) {
            const itemPath = path.join(assetsDir, item);
            const stat = fs.statSync(itemPath);

            if (stat.isFile()) assetPaths.push(itemPath);
        }

        // return if icons folder does not exist
        if (fs.existsSync(iconsPath)) {
            const iconItems = fs.readdirSync(iconsPath);
            for (const item of iconItems) {
                const itemPath = path.join(iconsPath, item);
                const stat = fs.statSync(itemPath);

                if (stat.isFile()) assetPaths.push(itemPath);
            }
        }
    } catch (e) {
        console.error('Error reading assets directory', e);
    }

    const assetsName = [];

    for (const asset of assetPaths) {
        const pathParts = asset.split(path.sep);
        const prefix = pathParts[pathParts.length - 2] === 'icons' ? `icons${path.sep}` : '';
        const filename = prefix + pathParts[pathParts.length - 1];
        assetsName.push(filename);
    }
    return assetsName;
};

/**
 * Get all the assets & their linkedPage
 * @param {string} workdir
 * @returns {Object[]}
 */
const getAssetsWithPages = function (workdir) {
    const projectJSONPath = path.join(workdir, 'project.json');
    if (!fs.existsSync(projectJSONPath)) return [];

    const assetsName = getAllAssets(workdir);
    const projectJSON = fs.readFileSync(projectJSONPath, 'utf8');

    const project = JSON.parse(projectJSON);

    const assets = assetsName.map((filename) => {
        const linkedPages = [];

        // Search through all nodes
        project.nodes.forEach((node) => {
            const nodeId = node.id;

            // Check main node data
            if (node.data) {
                // Check formValues in node data
                if (node.data.formValues) {
                    searchInObject(node.data.formValues, nodeId, linkedPages, filename);
                }

                // Check elements array (for pages and activities)
                if (node.data.elements && Array.isArray(node.data.elements)) {
                    node.data.elements.forEach((element) => {
                        if (element.formValues) {
                            // Use element's contentId if available, otherwise use node id
                            const elementId = element.contentId || nodeId;
                            searchInObject(element.formValues, elementId, linkedPages, filename);
                        }
                    });
                }
            }
        });

        return {
            filename,
            type: getAssetType(filename),
            linkedPages: [...new Set(linkedPages)], // Remove duplicates
        };
    });

    return assets;
};

/**
 * Recursively search for filename in an object
 * @param {Object} obj - Object to search in
 * @param {string} id - ID to add to linkedPages if found
 * @param {string[]} linkedPages - Array to add IDs to
 * @param {string} filename - Filename to search for
 */
function searchInObject(obj, id, linkedPages, filename) {
    if (!obj || typeof obj !== 'object') return;

    Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'string') {
            if (value.includes(filename)) {
                if (!linkedPages.includes(id)) {
                    linkedPages.push(id);
                }
            }
        } else if (Array.isArray(value)) {
            value.forEach((item) => {
                if (typeof item === 'string') {
                    if (item.includes(filename)) {
                        if (!linkedPages.includes(id)) {
                            linkedPages.push(id);
                        }
                    }
                } else if (typeof item === 'object' && item !== null) {
                    searchInObject(item, id, linkedPages, filename);
                }
            });
        } else if (typeof value === 'object' && value !== null) {
            searchInObject(value, id, linkedPages, filename);
        }
    });
}

/**
 * @param {string}
 * @returns {string}
 */
const getAssetType = function (filename) {
    const mimeType = mime.lookup(filename);

    return mimeType.split('/')[0] ?? 'unknown';
};

const getUsedAssets = function (workdir) {
    // if(!fs.existsSync(path.join(workdir, 'project.json'))) return [];

    const projectJSON = fs.readFileSync(path.join(workdir, 'project.json'), 'utf8');
    const regex = /"assets[\\/\\\\]([^"]+)"/g;
    const matches = projectJSON.match(regex);

    if (!matches) return [];
    return matches.map((match) => {
        return (
            match
                .replace('assets/', '')
                .replaceAll('"', '')
                // To only keep the slash after icons
                .replace(/\/+/g, '/')
                .replace(/\\/g, '')
        );
    });
};

// TODO: Add a parameter to see if exporting or not to get data from content.json instead of project.json
const getUnusedAssets = function (workdir) {
    //? On first save this function is called before project.json is created
    if (!fs.existsSync(path.join(workdir, 'project.json'))) return [];

    const allAssets = getAllAssets(workdir);
    const usedAssets = getUsedAssets(workdir);

    const unusedAssets = [];
    for (const asset of allAssets) {
        if (!usedAssets.includes(asset)) {
            unusedAssets.push(asset);
        }
    }

    return unusedAssets;
};

/**
 * Delete an asset from the workdir
 * @param {string} workdir - The workking directory
 * @param {string} assetName - The name of the asset to delete
 * @returns {boolean} - True if the asset was successfully deleted, false otherwise
 */
const removeAsset = function (workdir, assetName) {
    const assetsDir = path.join(workdir, 'assets');
    const assetPath = path.join(assetsDir, assetName);

    if (!fs.existsSync(assetPath)) {
        console.error(`Asset ${assetName} does not exist.`);
        return false;
    }

    try {
        fs.unlinkSync(assetPath);
        return true;
    } catch (e) {
        console.error(`Error deleting asset ${assetName}`, e);
        return false;
    }
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
    getAssetsWithPages,
    getAssetType,
    removeAsset,
};
