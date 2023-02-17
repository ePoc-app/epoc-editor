const { app, BrowserWindow, Menu, ipcMain} = require('electron');
const {openEpocProject} = require('./file');

module.exports.setupMenu = function () {
    const mainMenu = [
        {
            label: 'App',
            submenu: [
                {
                    label: 'Quit',
                    accelerator: 'CmdOrCtrl+Q',
                    click: function () {
                        app.quit();
                    }
                }
            ]
        }, {
            label: 'File',
            submenu: [
                {
                    label: 'Nouveau',
                    accelerator: 'CmdOrCtrl+N',
                    click: function () {
                        BrowserWindow.getFocusedWindow().webContents.send('new');
                    }
                },
                {
                    label: 'Ouvrir',
                    accelerator: 'CmdOrCtrl+O',
                    click: function () {
                        BrowserWindow.getFocusedWindow().webContents.send('epocProjectOpened', openEpocProject());
                    }
                },
                {
                    label: 'Save',
                    accelerator: 'CmdOrCtrl+S',
                    click: function () {
                        BrowserWindow.getFocusedWindow().webContents.send('save');
                    }
                },
                {
                    label: 'Save as',
                    accelerator: 'Shift+CmdOrCtrl+S',
                    click: function () {
                        BrowserWindow.getFocusedWindow().webContents.send('save-as');
                    }
                }
            ]
        }, {
            label: 'Edit',
            submenu: [
                {label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:'},
                {label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:'},
                {type: 'separator'},
                {label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:'},
                {label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:'},
                {label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:'},
                {label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:'}
            ]
        }, {
            label: 'Help',
            submenu: [
                {label: 'About Application', selector: 'orderFrontStandardAboutPanel:'},
                {
                    label: 'Dev Tools',
                    accelerator: 'CmdOrCtrl+D',
                    click: function () {
                        BrowserWindow.getFocusedWindow().webContents.toggleDevTools();
                    }
                },
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click: function () {
                        BrowserWindow.getFocusedWindow().webContents.reload();
                    }
                }
            ]
        }
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(mainMenu));
};

