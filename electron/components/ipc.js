const { ipcMain } = require('electron');
const { getRecentFiles, openEPOC } = require('./file')

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

    ipcMain.on('openEPOC', () => {
        targetWindow.webContents.send('sendEPOC', openEPOC());
    });
}