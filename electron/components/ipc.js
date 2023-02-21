const { ipcMain } = require('electron');
const { getRecentFiles, pickEpocProject, openEpocProject, newEpocProject } = require('./file');

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
        sendToFrontend(targetWindow, 'epocProjectReady', await openEpocProject(epocProjectPath));
    });

    ipcMain.on('newEpocProject', async () => {
        sendToFrontend(targetWindow, 'epocProjectReady', await newEpocProject());
    });
};

const sendToFrontend = function(targetWindow, channel, data) {
    if (typeof data === 'string') {
        targetWindow.webContents.send(channel, data);
    } else {
        targetWindow.webContents.send(channel, JSON.stringify(data));
    }
};

module.exports = {
    setupIpcListener,
    sendToFrontend
};