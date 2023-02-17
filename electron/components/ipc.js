const { ipcMain, BrowserWindow} = require('electron');
const { getRecentFiles, openEpocProject, unzipEpocProject, newEpocProject} = require('./file');

/**
 * Setup ipc listeners that are received from renderer process
 * @param targetWindow
 */
setupIpcListener = function (targetWindow) {
    ipcMain.on('msg', (event, data) => {
        console.log(data);
    });

    ipcMain.on('toMain', (event, data) => {
        console.log(data);
    });

    ipcMain.on('getRecentProjects', () => {
        sendToFrontend(targetWindow, 'getRecentProjects', getRecentFiles());
    });

    ipcMain.on('openEpocProject', () => {
        sendToFrontend(targetWindow, 'epocProjectOpened', openEpocProject());
    });

    ipcMain.on('unzipEpocProject', async (event, epocProjectPath) => {
        sendToFrontend(targetWindow, 'epocProjectReady', await unzipEpocProject(epocProjectPath));
    });

    ipcMain.on('newEpocProject', async () => {
        sendToFrontend(targetWindow, 'epocProjectReady', await newEpocProject());
    });
}

sendToFrontend = function(targetWindow, channel, data) {
    if (typeof data === 'string') {
        targetWindow.webContents.send(channel, data);
    } else {
        targetWindow.webContents.send(channel, JSON.stringify(data));
    }
}

module.exports = {
    setupIpcListener,
    sendToFrontend
}