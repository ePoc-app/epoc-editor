const { ipcMain } = require('electron');
const { getRecentFiles, pickEpocProject, openEpocProject, newEpocProject, saveEpocProject } = require('./file');
const store = require('./store');
const path = require('path');

/**
 * Setup ipc listeners that are received from renderer process
 * @param targetWindow
 */
const setupIpcListener = function (targetWindow) {
    ipcMain.on('msg', (event, data) => {
        console.log(data);
    });

    ipcMain.on('toMain', (event, data) => {
        console.log(data);
    });

    ipcMain.on('getRecentProjects', () => {
        sendToFrontend(targetWindow, 'getRecentProjects', getRecentFiles());
    });

    ipcMain.on('pickEpocProject', () => {
        sendToFrontend(targetWindow, 'epocProjectPicked', pickEpocProject());
    });

    ipcMain.on('openEpocProject', async (event, epocProjectPath) => {
        const project = await openEpocProject(epocProjectPath);
        sendToFrontend(targetWindow, 'epocProjectReady', project);
        store.updateState('currentProject', project);
    });

    ipcMain.on('newEpocProject', async () => {
        const project = await newEpocProject();
        sendToFrontend(targetWindow, 'epocProjectReady', project);
        store.updateState('currentProject', project);
    });

    ipcMain.on('saveEpocProject', async () => {
        updateSavedProject(targetWindow, await saveEpocProject(store.state.currentProject));
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