const { ipcMain } = require('electron');
const path = require('path');
const store = require('./store');
const { runPreview } = require('./preview');
const { getRecentFiles, pickEpocProject, openEpocProject, newEpocProject, saveEpocProject, exportProject, writeProjectData, readProjectData, copyFileToWorkdir } = require('./file');

/**
 * Setup ipc listeners that are received from renderer process
 * @param targetWindow
 */
const setupIpcListener = function (targetWindow) {
    ipcMain.on('getRecentProjects', () => {
        sendToFrontend(targetWindow, 'getRecentProjects', getRecentFiles());
    });

    ipcMain.on('getCurrentProject', async () => {
        if (store.state.currentProject && store.state.currentProject.workdir) {
            const flow = await readProjectData(store.state.currentProject.workdir);
            sendToFrontend(targetWindow, 'epocProjectReady', {project: store.state.currentProject, flow});
        }
    });

    ipcMain.on('pickEpocProject', () => {
        sendToFrontend(targetWindow, 'epocProjectPicked', pickEpocProject());
    });

    ipcMain.on('openEpocProject', async (event, epocProjectPath) => {
        const project = await openEpocProject(epocProjectPath);
        const flow = await readProjectData(project.workdir);
        sendToFrontend(targetWindow, 'epocProjectReady', {project, flow});
        store.updateState('currentProject', project);
    });

    ipcMain.on('newEpocProject', async () => {
        const project = await newEpocProject();
        sendToFrontend(targetWindow, 'epocProjectReady', {project});
        store.updateState('currentProject', project);
    });

    ipcMain.on('saveEpocProject', async () => {
        updateSavedProject(targetWindow, await saveEpocProject(store.state.currentProject));
    });

    ipcMain.on('runPreview', async (event, contentPath) => {
        await runPreview(store.state.currentProject.workdir, contentPath);
        sendToFrontend(targetWindow, 'previewReady');
    });

    ipcMain.on('exportProject', async () => {
        await exportProject(store.state.currentProject.workdir, store.state.currentProject.filepath);
        sendToFrontend(targetWindow, 'projectExported');
    });

    ipcMain.on('writeProjectData', async (event, data) => {
        await writeProjectData(store.state.currentProject.workdir, data);
    });

    ipcMain.on('importFile', async (event, filepath) => {
        sendToFrontend(targetWindow, 'fileImported', await copyFileToWorkdir(store.state.currentProject.workdir, filepath));
    });
};

const sendToFrontend = function(targetWindow, channel, data) {
    if (typeof data === 'string') {
        targetWindow.webContents.send(channel, data);
    } else {
        targetWindow.webContents.send(channel, JSON.stringify(data));
    }
};

const updateSavedProject = function (targetWindow, filepath) {
    if (filepath) {
        const project = {
            name: path.basename(filepath),
            filepath: filepath,
            workdir: store.state.currentProject.workdir,
            modified: new Date().toISOString()
        };
        store.updateState('currentProject', project);
        sendToFrontend(targetWindow, 'epocProjectSaved', project);
    }
};

module.exports = {
    setupIpcListener,
    sendToFrontend,
    updateSavedProject
};