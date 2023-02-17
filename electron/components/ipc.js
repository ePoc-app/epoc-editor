const { ipcMain } = require('electron');
const { getRecentFiles, openEpocProject, unzipEpocProject } = require('./file')
const {wait} = require('./utils');

/**
 * Setup ipc listeners that are received from renderer process
 * @param targetWindow
 */
module.exports.setupIpcListener = function (targetWindow) {
    ipcMain.on('msg', (event, data) => {
        console.log(data);
    });

    ipcMain.on('toMain', (event, data) => {
        console.log(data);
    });

    ipcMain.on('getRecentProjects', () => {
        targetWindow.webContents.send('getRecentProjects', getRecentFiles());
    });

    ipcMain.on('openEpocProject', () => {
        targetWindow.webContents.send('epocProjectOpened', openEpocProject());
    });

    ipcMain.on('unzipEpocProject', async (event, epocProjectPath) => {
        await wait(1000);
        targetWindow.webContents.send('epocProjectReady', unzipEpocProject(epocProjectPath));
    });
}