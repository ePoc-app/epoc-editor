const { app, shell, BrowserWindow, Menu } = require('electron');
const { sendToFrontend, updateSavedProject } = require('./ipc');
const { pickEpocToImport, pickEpocProject, getRecentFiles, saveEpocProject, saveAsEpocProject } = require('./file');
const store = require('./store');
const { ipcMain, dialog } = require('electron');
const Store = require('electron-store');
const electronStore = new Store();
const { getCommitHash } = require('./preview');
const { createGlobalPreview, createPreview } = require('./preview');

module.exports.setupMenu = function () {
    const mainMenuTemplate = [
        {
            label: 'App',
            submenu: [
                { label: 'À propos', role: 'about' },
                {
                    label: 'Nouvelle fenêtre',
                    click: function () {
                        ipcMain.emit('newWindow');
                    },
                },
                {
                    label: 'Quitter',
                    accelerator: 'CmdOrCtrl+Q',
                    click: function () {
                        app.quit();
                    },
                },
            ],
        },
        {
            label: 'Fichier',
            submenu: [
                {
                    label: 'Nouveau',
                    accelerator: 'CmdOrCtrl+N',
                    click: function () {
                        sendToFrontend(BrowserWindow.getFocusedWindow(), 'epocProjectNew');
                    },
                },
                {
                    label: 'Ouvrir',
                    accelerator: 'CmdOrCtrl+O',
                    click: function () {
                        sendToFrontend(BrowserWindow.getFocusedWindow(), 'epocProjectPicked', pickEpocProject());
                    },
                },
                {
                    label: 'Projet récents',
                    submenu: [
                        ...getRecentFiles().map((project) => {
                            return {
                                label: project.filepath,
                                click: function () {
                                    const currentWindow = BrowserWindow.getFocusedWindow();
                                    currentWindow.filepath = project.filepath;
                                    sendToFrontend(currentWindow, 'epocProjectPicked', project);
                                },
                            };
                        }),
                    ],
                },
                {
                    label: 'Importer un fichier .epoc',
                    click: async function () {
                        const currentWindow = BrowserWindow.getFocusedWindow();
                        sendToFrontend(currentWindow, 'epocImportPicked');
                        const project = await pickEpocToImport();
                        store.updateState('projects', { [currentWindow.id]: project });
                        currentWindow.filepath = project.filepath;
                        sendToFrontend(currentWindow, 'epocImportExtracted', project);
                    },
                },
                // {
                //     label: 'Rétrocompatibilité',
                //     submenu: [
                //         // {
                //         //     label: 'Mode ePoc v1',
                //         //     type: 'checkbox'
                //         // },
                //         // {
                //         //     type: 'separator'
                //         // },
                //         {
                //             label: 'Importer ePoc v1',
                //             click: async function () {
                //                 sendToFrontend(BrowserWindow.getFocusedWindow(), 'epocImportPicked');
                //                 const project = await pickEpocToImport();
                //                 store.updateState('projects', {[BrowserWindow.getFocusedWindow().id]: project });
                //                 sendToFrontend(BrowserWindow.getFocusedWindow(), 'epocImportExtracted', project);
                //             }
                //         }
                //         // {
                //         //     label: 'Export ePoc v1',
                //         //     click: async function () {
                //         //         console.log('todo');
                //         //     }
                //         // }
                //     ]
                // },
                {
                    id: 'save',
                    label: 'Sauvegarder',
                    accelerator: 'CmdOrCtrl+S',
                    enabled: !!(
                        store.state.projects[BrowserWindow.getFocusedWindow().id] &&
                        store.state.projects[BrowserWindow.getFocusedWindow().id].workdir
                    ),
                    click: async function () {
                        sendToFrontend(BrowserWindow.getFocusedWindow(), 'epocProjectSaving');
                        const result = await saveEpocProject(store.state.projects[BrowserWindow.getFocusedWindow().id]);
                        if (result) {
                            updateSavedProject(BrowserWindow.getFocusedWindow().webContents, result);
                        } else {
                            sendToFrontend(BrowserWindow.getFocusedWindow().webContents, 'epocProjectSaveCanceled');
                        }
                    },
                },
                {
                    id: 'saveAs',
                    label: 'Sauvegarder sous...',
                    accelerator: 'Shift+CmdOrCtrl+S',
                    enabled: !!(
                        store.state.projects[BrowserWindow.getFocusedWindow().id] &&
                        store.state.projects[BrowserWindow.getFocusedWindow().id].workdir
                    ),
                    click: async function () {
                        const currentWindow = BrowserWindow.getFocusedWindow();
                        sendToFrontend(currentWindow, 'epocProjectSaving');
                        const result = await saveAsEpocProject(
                            store.state.projects[currentWindow.id]
                        );
                        if (result) {
                            currentWindow.filepath = result;
                            updateSavedProject(currentWindow.webContents, result);
                        } else {
                            sendToFrontend(currentWindow.webContents, 'epocProjectSaveCanceled');
                        }
                    },
                },
            ],
        },
        {
            label: 'Édition',
            submenu: [
                {
                    label: 'Annuler',
                    accelerator: 'CmdOrCtrl+Z',
                    click: function () {
                        sendToFrontend(BrowserWindow.getFocusedWindow(), 'undo');
                    },
                },
                {
                    label: 'Rétablir',
                    accelerator: process.platform === 'darwin' ? 'Shift+CmdOrCtrl+Z' : 'CmdOrCtrl+Y',
                    click: function () {
                        sendToFrontend(BrowserWindow.getFocusedWindow(), 'redo');
                    },
                },
                { type: 'separator' },
                { label: 'Couper', accelerator: 'CmdOrCtrl+X', role: 'cut' },
                { label: 'Copier', accelerator: 'CmdOrCtrl+C', role: 'copy' },
                { label: 'Coller', accelerator: 'CmdOrCtrl+V', role: 'paste' },
                { label: 'Tout sélectionner', accelerator: 'CmdOrCtrl+A', role: 'selectAll' },
                { type: 'separator' },
                {
                    label: "Vérifier l'orthographe lors de la saisie",
                    type: 'checkbox',
                    checked: electronStore.get('spellcheck'),
                    click: function () {
                        electronStore.set('spellcheck', !electronStore.get('spellcheck'));

                        const webContents = BrowserWindow.getFocusedWindow().webContents;

                        webContents.session.setSpellCheckerEnabled(electronStore.get('spellcheck'));
                        webContents.reload();
                    },
                },
            ],
        },
        {
            label: 'Aperçu',
            submenu: [
                {
                    label: 'Lancer l\'aperçu',
                    click: function () {
                        createPreview(store.state.projects[BrowserWindow.getFocusedWindow().id].workdir);
                    }
                },
                {
                    label: 'Lancer l\'aperçu global',
                    click: function () {
                        createGlobalPreview(store.state.projects[BrowserWindow.getFocusedWindow().id].workdir);
                    }
                }
            ]
        },
        {
            label: 'Aide',
            submenu: [
                {
                    label: 'Documentation',
                    click: async function () {
                        await shell.openExternal('https://epoc.inria.fr/guide/user/getting-started/');
                    },
                },
                {
                    label: 'Signaler un problème',
                    click: async function () {
                        const isDev = process.env.IS_DEV === 'true';

                        const emailSubject = 'Aide éditeur';
                        const emailRecipient = 'ill-ePoc-contact@inria.fr';
                        let emailBody = '';
                        if (isDev) {
                            const appVersion = app.getVersion();
                            emailBody = encodeURIComponent(
                                `Version: ${appVersion}\n---\n\nDécrivez votre problème ci-dessous:\n\n`
                            );
                        } else {
                            const appInfo = require('../../dist/appInfo.json');
                            emailBody = encodeURIComponent(
                                `Version: ${appInfo.version}\nBuild: ${appInfo.buildNumber}\n ---\n\nDécrivez votre problème ci-dessous:\n\n`
                            );
                        }

                        const mailtoLink = `mailto:${emailRecipient}?subject=${emailSubject}&body=${emailBody}`;

                        await shell.openExternal(mailtoLink);
                    },
                },
                { type: 'separator' },
                {
                    label: 'Outils de développement',
                    accelerator: 'CmdOrCtrl+D',
                    click: function () {
                        BrowserWindow.getFocusedWindow().webContents.toggleDevTools();
                    },
                },
                {
                    label: 'Recharger',
                    accelerator: 'CmdOrCtrl+R',
                    click: function () {
                        BrowserWindow.getFocusedWindow().webContents.reload();
                    },
                },
            ],
        },
    ];

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    Menu.setApplicationMenu(mainMenu);

    // Update menu on different state
    store.em.on('stateUpdated', () => {
        const isProjectOpened =
            store.state.projects[BrowserWindow.getFocusedWindow().id] &&
            store.state.projects[BrowserWindow.getFocusedWindow().id].workdir;
        mainMenu.getMenuItemById('save').enabled = isProjectOpened;
        mainMenu.getMenuItemById('saveAs').enabled = isProjectOpened;
    });
};

module.exports.setupMenuPreview = function () {
    const previewMenuTemplate = [
        {
            label: 'App',
            submenu: [
                { label: 'About Application', role: 'about' },
                {
                    label: 'Quit',
                    accelerator: 'CmdOrCtrl+Q',
                    click: function () {
                        app.quit();
                    },
                },
            ],
        },
        {
            label: 'Preview',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click: function () {
                        BrowserWindow.getFocusedWindow().webContents.reload();
                    },
                },
                {
                    label: 'Commit hash',
                    click: function () {
                        const hash = getCommitHash();
                        if(!hash) return;

                        dialog.showMessageBox({
                            title: 'Commit hash',
                            message: hash,
                            buttons: ['OK']
                        });
                    },
                },
                {
                    label: 'Reset data',
                    click: function () {
                        BrowserWindow.getFocusedWindow().webContents.executeJavaScript(`
                          // Clear IndexedDB
                          indexedDB.deleteDatabase('__epocdb');
                          console.log('clear db');
                          location.reload();
                        `);
                    },
                },
                {
                    label: 'Dev Tools',
                    accelerator: 'CmdOrCtrl+D',
                    click: function () {
                        BrowserWindow.getFocusedWindow().webContents.toggleDevTools();
                    },
                },
            ],
        },
    ];
    const previewMenu = Menu.buildFromTemplate(previewMenuTemplate);
    Menu.setApplicationMenu(previewMenu);
};
