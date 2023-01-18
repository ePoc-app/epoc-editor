const { dialog, BrowserWindow} = require('electron');
const path = require('path');
const fs = require('fs');

/**
 * Open a dialog to choose a text file and return its content
 * @returns {string}
 */
module.exports.openFile = function () {
    const files = dialog.showOpenDialogSync(BrowserWindow.getFocusedWindow(), {
        properties: ['openFile'],
        filters: [{ name: 'Markdown', extensions: ['md', 'markdown', 'txt']}]
    });
    if(!files) return;

    const file = files[0];
    return fs.readFileSync(file).toString();
}

/**
 * Open a dialog to choose an ePoc file or project and return its content
 * @returns {string}
 */
module.exports.openEPOC = function () {
    const files = dialog.showOpenDialogSync(BrowserWindow.getFocusedWindow(), {
        properties: ['openFile'],
        filters: [{ name: 'ePoc', extensions: ['epoc', 'json']}]
    });
    if(!files) return;

    const file = files[0];
    return fs.readFileSync(file).toString();
}

/**
 * Get the list of recently opened ePoc projects
 * @returns {string}
 */
module.exports.getRecentFiles = function () {
    //TODO: This solution surely won't work anymore with real data
    return fs.readFileSync(`${path.join(__dirname, '../../dist/epocs.json')}`).toString();
}