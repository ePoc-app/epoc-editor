const { app, BrowserWindow, Menu } = require('electron');
const { sendToFrontend, updateSavedProject } = require('./ipc');
const { pickEpocProject, getRecentFiles, saveEpocProject, saveAsEpocProject } = require('./file');
const store = require('./store');

module.exports.setupMenu = function () {
    const mainMenuTemplate = [
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
                        sendToFrontend(BrowserWindow.getFocusedWindow(),'epocProjectNew');
                    }
                },
                {
                    label: 'Ouvrir',
                    accelerator: 'CmdOrCtrl+O',
                    click: function () {
                        sendToFrontend(BrowserWindow.getFocusedWindow(), 'epocProjectPicked', pickEpocProject());
                    }
                },
                {
                    label: 'Projet récents',
                    submenu: [
                        ...getRecentFiles().map((project) => {
                            return {
                                label: project.filepath,
                                click: function () {
                                    sendToFrontend(BrowserWindow.getFocusedWindow(), 'epocProjectPicked', project);
                                }
                            };
                        })
                    ]
                },
                {
                    id: 'save',
                    label: 'Save',
                    accelerator: 'CmdOrCtrl+S',
                    enabled: false,
                    click: async function () {
                        updateSavedProject(BrowserWindow.getFocusedWindow(),await saveEpocProject(store.state.currentProject));
                    }
                },
                {
                    id: 'saveAs',
                    label: 'Save as',
                    accelerator: 'Shift+CmdOrCtrl+S',
                    enabled: false,
                    click: async function () {
                        updateSavedProject(BrowserWindow.getFocusedWindow(), await saveAsEpocProject(store.state.currentProject));
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

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    Menu.setApplicationMenu(mainMenu);

    // Update menu on different state
    store.em.on('stateUpdated', () => {
        const isProjectOpened = store.state.currentProject.workdir;
        mainMenu.getMenuItemById('save').enabled = isProjectOpened;
        mainMenu.getMenuItemById('saveAs').enabled = isProjectOpened;
    });

};



