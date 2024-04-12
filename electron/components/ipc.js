const path = require('path');
const store = require('./store');
const { ipcMain } = require('electron');
const { runPreview, updatePreview } = require('./preview');
const {
    getRecentFiles,
    pickEpocProject,
    openEpocProject,
    newEpocProject,
    saveEpocProject,
    exportProject,
    writeProjectData,
    writeEpocData,
    readProjectData,
    copyFileToWorkdir,
} = require('./file');
const { Menu } = require('electron');
const contextMenu = require('./contextMenu');

const { app } = require('electron');

const copyData = {
    pages: null,
    sourceId: null,
};

/**
 * Setup ipc listeners that are received from renderer process
 * @param targetWindow
 */
const setupIpcListener = function (targetWindow) {
    ipcMain.on('getRecentProjects', (event) => {
        if (event.sender !== targetWindow.webContents) return;
        sendToFrontend(event.sender, 'getRecentProjects', getRecentFiles());
    });

    ipcMain.on('getCurrentProject', async (event) => {
        if (event.sender !== targetWindow.webContents) return;

        if (store.state.projects[targetWindow.id] && store.state.projects[targetWindow.id].workdir) {
            const flow = await readProjectData(store.state.projects[targetWindow.id].workdir);
            sendToFrontend(event.sender, 'epocProjectReady', { project: store.state.projects[targetWindow.id], flow });
        }
    });

    ipcMain.on('pickEpocProject', (event) => {
        if (event.sender !== targetWindow.webContents) return;

        sendToFrontend(event.sender, 'epocProjectPicked', pickEpocProject());
    });

    ipcMain.on('openEpocProject', async (event, epocProjectPath) => {
        if (event.sender !== targetWindow.webContents) return;

        const { project, imported } = await openEpocProject(epocProjectPath);
        if (!project) {
            sendToFrontend(event.sender, 'epocProjectError');
            return;
        }


        if(imported) {
            sendToFrontend(event.sender, 'importRequired', project);
        } else {
            const flow = await readProjectData(project.workdir);
            sendToFrontend(event.sender, 'epocProjectReady', { project, flow });
            store.updateState('projects', { [targetWindow.id]: project });
        }

    });

    ipcMain.on('newEpocProject', async (event) => {
        if (event.sender !== targetWindow.webContents) return;

        const project = await newEpocProject();
        sendToFrontend(event.sender, 'epocProjectReady', { project });
        store.updateState('projects', { [targetWindow.id]: project });
    });

    ipcMain.on('saveEpocProject', async (event, data) => {
        if (event.sender !== targetWindow.webContents) return;

        sendToFrontend(event.sender, 'epocProjectSaving');

        const { data: projectData, content } = data;
        await writeProjectData(store.state.projects[targetWindow.id].workdir, projectData);
        await writeEpocData(store.state.projects[targetWindow.id].workdir, content);

        updateSavedProject(event.sender, await saveEpocProject(store.state.projects[targetWindow.id]));
    });

    ipcMain.on('runPreview', async (event, data) => {
        if (event.sender !== targetWindow.webContents) return;

        try {
            const { contentPath, projectJSON } = data;
            const { data: projectData, content } = projectJSON;
            await writeProjectData(store.state.projects[targetWindow.id].workdir, projectData);
            await writeEpocData(store.state.projects[targetWindow.id].workdir, content);

            await runPreview(store.state.projects[targetWindow.id].workdir, contentPath);
            sendToFrontend(event.sender, 'previewReady');
        } catch (e) {
            console.error(e);
            sendToFrontend(event.sender, 'previewError');
        }
    });

    ipcMain.on('exportProject', async (event, data) => {
        if (event.sender !== targetWindow.webContents) return;

        try {
            const { data: projectData, content } = data;
            await writeProjectData(store.state.projects[targetWindow.id].workdir, projectData);
            await writeEpocData(store.state.projects[targetWindow.id].workdir, content);

            await exportProject(
                store.state.projects[targetWindow.id].workdir,
                store.state.projects[targetWindow.id].filepath
            );
            sendToFrontend(event.sender, 'projectExported');
        } catch (e) {
            console.error(e);
            sendToFrontend(event.sender, 'exportError');
        }
    });

    ipcMain.on('writeProjectData', async (event, data) => {
        if (event.sender !== targetWindow.webContents) return;

        await writeProjectData(store.state.projects[targetWindow.id].workdir, data);
    });

    ipcMain.on('writeEpocData', async (event, data) => {
        if (event.sender !== targetWindow.webContents) return;

        await writeEpocData(store.state.projects[targetWindow.id].workdir, data);
        updatePreview();
    });

    ipcMain.on('importFile', async (event, data) => {
        if (event.sender !== targetWindow.webContents) return;

        const { filepath, targetDirectory } = data;
        sendToFrontend(
            event.sender,
            'fileImported',
            await copyFileToWorkdir(store.state.projects[targetWindow.id].workdir, filepath, targetDirectory)
        );
    });

    ipcMain.on('graphCopy', async (event, data) => {
        if (event.sender !== targetWindow.webContents) return;

        const parsedData = JSON.parse(data);
        const { pages } = parsedData;

        copyData.pages = pages;
        copyData.sourceId = targetWindow.id;
    });

    ipcMain.on('graphPaste', async (event, data) => {
        if (event.sender !== targetWindow.webContents) return;
        if (!copyData.pages) return;

        const parsedData = JSON.parse(data);
        const { position } = parsedData;

        if (copyData.sourceId !== targetWindow.id) {
            const assets = detectAssets(copyData.pages);
            for (const asset of assets) {
                const assetPath = path.join(store.state.projects[copyData.sourceId].workdir, asset);
                await copyFileToWorkdir(store.state.projects[targetWindow.id].workdir, assetPath);
            }
        }

        sendToFrontend(event.sender, 'graphPasted', { selectedPages: copyData.pages, position });

        copyData.pages = null;
        copyData.sourceId = null;
    });

    ipcMain.on('contextMenu', async (event, data) => {
        const popupMenu = Menu.buildFromTemplate(contextMenu.getTemplateFromContext(sendToFrontend, data));
        popupMenu.popup(targetWindow.webContents);

        popupMenu.on('menu-will-close', () => {
            sendToFrontend(targetWindow.webContents, 'contextMenuClosed');
        });
    });

    ipcMain.on('getEditorVersion', async(event) => {
        if(event.sender !== targetWindow.webContents) return;

        sendToFrontend(event.sender, 'editorVersion', { version: app.getVersion() });
    });


    ipcMain.on('getPlatform', async(event) => {
        if(event.sender !== targetWindow.webContents) return;

        sendToFrontend(event.sender, 'platform', { platform: process.platform });
    });
};

const sendToFrontend = function (webContents, channel, data) {
    if (typeof data === 'string') {
        webContents.send(channel, data);
    } else {
        webContents.send(channel, JSON.stringify(data));
    }
};

const updateSavedProject = function (webContents, filepath) {
    if (filepath) {
        const project = {
            name: path.basename(filepath),
            filepath: filepath,
            workdir: store.state.projects[webContents.id].workdir,
            modified: new Date().toISOString(),
        };
        store.updateState('projects', { [webContents.id]: project });
        sendToFrontend(webContents, 'epocProjectSaved', project);
    }
};

/**
 * Detect & return all assets paths from a given data
 * @param data
 * @returns {String[]}
 */
const detectAssets = function (data) {
    if (!data) return;

    const formValues = [];
    for (const page of data) {
        for (const element of page.data.elements) {
            formValues.push(element.formValues);
        }
    }

    const regex = /assets\/[^"\\]*/g;
    const assetPaths = [];
    const jsonFormValues = JSON.stringify(formValues);
    const matches = jsonFormValues.matchAll(regex);
    for (const match of matches) {
        const path = match[0];
        if (!assetPaths.includes(path)) {
            assetPaths.push(path);
        }
    }

    return assetPaths;
};

module.exports = {
    setupIpcListener,
    sendToFrontend,
    updateSavedProject,
};
