const { app, BrowserWindow, Menu } = require('electron');
const { sendToFrontend, updateSavedProject } = require('./ipc');
const { pickEpocToImport, pickEpocProject, getRecentFiles, saveEpocProject, saveAsEpocProject } = require('./file');
const store = require('./store');

module.exports.setupMenu = function () {
    const mainMenuTemplate = [
        {
            label: 'App',
            submenu: [
                {label: 'À propos', selector: 'orderFrontStandardAboutPanel:'},
                {
                    label: 'Quitter',
                    accelerator: 'CmdOrCtrl+Q',
                    click: function () {
                        app.quit();
                    }
                }
            ]
        }, {
            label: 'Fichier',
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
                    label: 'Importer',
                    click: async function () {
                        sendToFrontend(BrowserWindow.getFocusedWindow(), 'epocImportPicked');
                        const project = await pickEpocToImport();
                        store.updateState('currentProject', project);
                        sendToFrontend(BrowserWindow.getFocusedWindow(), 'epocImportExtracted', project);
                    }
                },
                {
                    id: 'save',
                    label: 'Sauvegarder',
                    accelerator: 'CmdOrCtrl+S',
                    enabled: !!(store.state.currentProject && store.state.currentProject.workdir),
                    click: async function () {
                        sendToFrontend(BrowserWindow.getFocusedWindow(), 'epocProjectSaving');
                        const result = await saveEpocProject(store.state.currentProject);
                        if (result) {
                            updateSavedProject(BrowserWindow.getFocusedWindow(), result);
                        } else {
                            sendToFrontend(BrowserWindow.getFocusedWindow(), 'epocProjectSaveCanceled');
                        }
                    }
                },
                {
                    id: 'saveAs',
                    label: 'Sauvegarder sous...',
                    accelerator: 'Shift+CmdOrCtrl+S',
                    enabled: !!(store.state.currentProject && store.state.currentProject.workdir),
                    click: async function () {
                        sendToFrontend(BrowserWindow.getFocusedWindow(), 'epocProjectSaving');
                        const result = await saveAsEpocProject(store.state.currentProject);
                        if (result) {
                            updateSavedProject(BrowserWindow.getFocusedWindow(), result);
                        } else {
                            sendToFrontend(BrowserWindow.getFocusedWindow(), 'epocProjectSaveCanceled');
                        }
                    }
                }
            ]
        }, {
            label: 'Édition',
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
            label: 'Aide',
            submenu: [
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
        const isProjectOpened = store.state.currentProject && store.state.currentProject.workdir;
        mainMenu.getMenuItemById('save').enabled = isProjectOpened;
        mainMenu.getMenuItemById('saveAs').enabled = isProjectOpened;
    });

};

module.exports.setupMenuPreview = function () {
    const previewMenuTemplate = [
        {
            label: 'App',
            submenu: [
                {label: 'About Application', selector: 'orderFrontStandardAboutPanel:'},
                {
                    label: 'Quit',
                    accelerator: 'CmdOrCtrl+Q',
                    click: function () {
                        app.quit();
                    }
                }
            ]
        }, {
            label: 'Preview',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click: function () {
                        BrowserWindow.getFocusedWindow().webContents.reload();
                    }
                },
                {
                    label: 'Dev Tools',
                    accelerator: 'CmdOrCtrl+D',
                    click: function () {
                        BrowserWindow.getFocusedWindow().webContents.toggleDevTools();
                    }
                }
            ]
        }
    ];
    const previewMenu = Menu.buildFromTemplate(previewMenuTemplate);
    Menu.setApplicationMenu(previewMenu);
};



