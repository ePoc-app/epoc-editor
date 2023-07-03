const { app, BrowserWindow, Menu } = require('electron');
const { sendToFrontend, updateSavedProject } = require('./ipc');
const { pickEpocToImport, pickEpocProject, getRecentFiles, saveEpocProject, saveAsEpocProject } = require('./file');
const store = require('./store');
const { ipcMain } = require('electron');

module.exports.setupMenu = function () {
    const mainMenuTemplate = [
        {
            label: 'App',
            submenu: [
                {label: 'À propos', selector: 'orderFrontStandardAboutPanel:'},
                {
                    label: 'Nouvelle fenêtre',
                    click: function () {
                        ipcMain.emit('newWindow');
                    }
                },
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
                    label: 'Rétrocompatibilité',
                    submenu: [
                        // {
                        //     label: 'Mode ePoc v1',
                        //     type: 'checkbox'
                        // },
                        // {
                        //     type: 'separator'
                        // },
                        {
                            label: 'Importer ePoc v1',
                            click: async function () {
                                sendToFrontend(BrowserWindow.getFocusedWindow(), 'epocImportPicked');
                                const project = await pickEpocToImport();
                                store.updateState('projects', {[BrowserWindow.getFocusedWindow().id]: project });
                                sendToFrontend(BrowserWindow.getFocusedWindow(), 'epocImportExtracted', project);
                            }
                        }
                        // {
                        //     label: 'Export ePoc v1',
                        //     click: async function () {
                        //         console.log('todo');
                        //     }
                        // }
                    ]
                },
                {
                    id: 'save',
                    label: 'Sauvegarder',
                    accelerator: 'CmdOrCtrl+S',
                    enabled: !!(store.state.projects[BrowserWindow.getFocusedWindow().id] && store.state.projects[BrowserWindow.getFocusedWindow().id].workdir),
                    click: async function () {
                        sendToFrontend(BrowserWindow.getFocusedWindow(), 'epocProjectSaving');
                        const result = await saveEpocProject(store.state.projects[BrowserWindow.getFocusedWindow().id]);
                        if (result) {
                            updateSavedProject(BrowserWindow.getFocusedWindow().webContents, result);
                        } else {
                            sendToFrontend(BrowserWindow.getFocusedWindow().webContents, 'epocProjectSaveCanceled');
                        }
                    }
                },
                {
                    id: 'saveAs',
                    label: 'Sauvegarder sous...',
                    accelerator: 'Shift+CmdOrCtrl+S',
                    enabled: !!(store.state.projects[BrowserWindow.getFocusedWindow().id] && store.state.projects[BrowserWindow.getFocusedWindow().id].workdir),
                    click: async function () {
                        sendToFrontend(BrowserWindow.getFocusedWindow(), 'epocProjectSaving');
                        const result = await saveAsEpocProject(store.state.projects[BrowserWindow.getFocusedWindow().id]);
                        if (result) {
                            updateSavedProject(BrowserWindow.getFocusedWindow().webContents, result);
                        } else {
                            sendToFrontend(BrowserWindow.getFocusedWindow().webContents, 'epocProjectSaveCanceled');
                        }
                    }
                }
            ]
        }, {
            label: 'Édition',
            submenu: [
                {
                    label: 'Undo',
                    accelerator: 'CmdOrCtrl+Z',
                    selector: 'undo:',
                    click: function() {
                        sendToFrontend(BrowserWindow.getFocusedWindow(), 'undo');
                    }
                },
                {
                    label: 'Redo',
                    accelerator: process.platform === 'darwin' ? 'Shift+CmdOrCtrl+Z' : 'CmdOrCtrl+Y',
                    selector: 'redo:',
                    click: function() {
                        sendToFrontend(BrowserWindow.getFocusedWindow(), 'redo');
                    }
                },
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
        const isProjectOpened = store.state.projects[BrowserWindow.getFocusedWindow().id] && store.state.projects[BrowserWindow.getFocusedWindow().id].workdir;
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