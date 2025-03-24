const { BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { setupIpcListener, sendToFrontend } = require('./ipc');
const store = require('./store');
const { Menu, app } = require('electron');
const {
    pickEpocProject,
    pickEpocToImport,
    getRecentFiles,
    saveEpocProject,
    updateSavedProject,
    saveAsEpocProject,
    createPreview,
    createGlobalPreview,
} = require('./file');
const i18n = require('../i18n/i18next.config.js');

const Store = require('electron-store');
const electronStore = new Store();

i18n.on('initialized', () => {
    console.log('i18next initialized successfully');
});

i18n.on('failedLoading', (lng, ns, msg) => {
    console.error('i18next failed to load:', msg);
});

/**
 * Create the app main window
 * @returns {Electron.CrossProcessExports.BrowserWindow}
 */
const createMainWindow = function () {
    const isDev = process.env.IS_DEV === 'true';
    const mainWindow = new BrowserWindow({
        show: false,
        icon: 'favicon.png',
        width: 1500,
        height: 1200,
        minHeight: 400,
        minWidth: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, '../preload.js'),
            partition: `persist:${Math.random()}`,
        },
    });

    if (electronStore.get('spellcheck') === undefined) electronStore.set('spellcheck', true);
    mainWindow.webContents.session.setSpellCheckerEnabled(electronStore.get('spellcheck'));

    mainWindow.on('focus', () => {
        setupMenu();
    });

    // load the index.html of the app.
    mainWindow
        .loadURL(isDev ? 'http://localhost:8000' : `file://${path.join(__dirname, '../../dist/index.html')}`)
        .then();
    mainWindow.center();

    store.state.projects[mainWindow.id] = {};

    return mainWindow;
};

const setupWindow = function (window, filepath) {
    // Intercept assets:// protocol to serve local files from workdir
    try {
        window.webContents.session.protocol.registerFileProtocol('assets', (request, callback) => {
            const workdir = store.state.projects[window.id].workdir;
            const filepath = request.url.substring(9);
            callback({ path: path.join(workdir, filepath) });
        });
    } catch (error) {
        console.error('Failed to register protocol:', error);
    }

    const windowsUrl = [
        `file:///${encodeURI(path.join(__dirname, '../../dist/assets/').replaceAll('\\', '/'))}*`,
        `file:///${encodeURI(path.join(__dirname, '../../dist/images/').replaceAll('\\', '/'))}*`,
        `file:///${encodeURI(path.join(__dirname, '../../dist/videos/').replaceAll('\\', '/'))}*`,
    ];

    const posixUrl = [
        `file://${encodeURI(path.join(__dirname, '../../dist/assets/'))}*`,
        `file://${encodeURI(path.join(__dirname, '../../dist/images/'))}*`,
        `file://${encodeURI(path.join(__dirname, '../../dist/videos/'))}*`,
    ];

    // Intercept all url starting with assets/ and redirect it to custom protocol (wysiwyg/quill)
    const filter = {
        urls: [
            'http://localhost:8000/assets/*',
            'http://localhost:8000/images/*',
            'http://localhost:8000/videos/*',

            ...(process.platform === 'win32' ? windowsUrl : posixUrl),
        ],
    };

    window.webContents.session.webRequest.onBeforeRequest(filter, (details, callback) => {
        const assetsFolder = ['assets/', 'images/', 'videos/'].find((folder) => details.url.includes(folder));
        const isAppFile = ['.js', '.css', '.html', '.ttf'].some((ext) => details.url.includes(ext));
        if (window.webContents.id === details.webContents.id && !isAppFile && assetsFolder) {
            const filepath = details.url.split(assetsFolder)[1];
            return callback({ redirectURL: `assets://${assetsFolder}${filepath}` });
        }
        callback({});
    });

    if (filepath) {
        window.webContents.send(
            'epocProjectPicked',
            JSON.stringify({ name: null, modified: null, filepath: filepath, workdir: null })
        );
    }
};

const createNewWindow = () => {
    const newWindow = createMainWindow();
    setupIpcListener(newWindow);
    setupWindow(newWindow);

    newWindow.show();

    return newWindow;
};

// Menu management

const setupMenu = () => {
    const mainMenuTemplate = [
        {
            label: i18n.t('menu.app.label'),
            submenu: [
                { label: i18n.t('menu.app.about'), role: 'about' },
                {
                    label: i18n.t('menu.app.quit'),
                    accelerator: 'CmdOrCtrl+Q',
                    click: function () {
                        app.quit();
                    },
                },
                { type: 'separator' },
                {
                    label: i18n.t('menu.app.lang'),
                    submenu: [
                        {
                            label: 'English',
                            type: 'radio',
                            checked: i18n.language === 'en',
                            click: () => changeLanguage('en'),
                        },
                        {
                            label: 'Français',
                            type: 'radio',
                            checked: i18n.language === 'fr',
                            click: () => changeLanguage('fr'),
                        },
                    ],
                },
            ],
        },
        {
            label: i18n.t('menu.file.label'),
            submenu: [
                {
                    label: i18n.t('menu.file.new'),
                    accelerator: 'CmdOrCtrl+N',
                    click: function () {
                        sendToFrontend(BrowserWindow.getFocusedWindow(), 'epocProjectNew');
                    },
                },
                {
                    label: i18n.t('menu.file.newWindow'),
                    click: function () {
                        ipcMain.emit('newWindow');
                    },
                },
                { type: 'separator' },
                {
                    label: i18n.t('menu.file.open'),
                    accelerator: 'CmdOrCtrl+O',
                    click: function () {
                        sendToFrontend(BrowserWindow.getFocusedWindow(), 'epocProjectPicked', pickEpocProject());
                    },
                },
                {
                    label: i18n.t('menu.file.openInNewWindow'),
                    click: () => {
                        const newWindow = createNewWindow();
                        const project = pickEpocProject();
                        ipcMain.on('initialized', () => {
                            sendToFrontend(newWindow, 'epocProjectPicked', project);
                        });
                    },
                },
                {
                    label: i18n.t('menu.file.latest'),
                    submenu: [
                        ...getRecentFiles().map((project) => {
                            return {
                                label: project.filepath,
                                click: function () {
                                    sendToFrontend(BrowserWindow.getFocusedWindow(), 'epocProjectPicked', project);
                                },
                            };
                        }),
                    ],
                },
                {
                    label: i18n.t('menu.file.import'),
                    click: async function () {
                        sendToFrontend(BrowserWindow.getFocusedWindow(), 'epocImportPicked');
                        const project = await pickEpocToImport();
                        store.updateState('projects', { [BrowserWindow.getFocusedWindow().id]: project });
                        sendToFrontend(BrowserWindow.getFocusedWindow(), 'epocImportExtracted', project);
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
                { type: 'separator' },
                {
                    id: 'save',
                    label: i18n.t('menu.file.save'),
                    accelerator: 'CmdOrCtrl+S',
                    enabled: !!(
                        store.state.projects[BrowserWindow.getFocusedWindow()?.id] &&
                        store.state.projects[BrowserWindow.getFocusedWindow()?.id].workdir
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
                    label: i18n.t('menu.file.saveAs'),
                    accelerator: 'Shift+CmdOrCtrl+S',
                    enabled: !!(
                        store.state.projects[BrowserWindow.getFocusedWindow()?.id] &&
                        store.state.projects[BrowserWindow.getFocusedWindow()?.id].workdir
                    ),
                    click: async function () {
                        sendToFrontend(BrowserWindow.getFocusedWindow(), 'epocProjectSaving');
                        const result = await saveAsEpocProject(
                            store.state.projects[BrowserWindow.getFocusedWindow().id]
                        );
                        if (result) {
                            updateSavedProject(BrowserWindow.getFocusedWindow().webContents, result);
                        } else {
                            sendToFrontend(BrowserWindow.getFocusedWindow().webContents, 'epocProjectSaveCanceled');
                        }
                    },
                },
            ],
        },
        {
            label: i18n.t('menu.edit.label'),
            submenu: [
                {
                    label: i18n.t('menu.edit.undo'),
                    accelerator: 'CmdOrCtrl+Z',
                    click: function () {
                        sendToFrontend(BrowserWindow.getFocusedWindow(), 'undo');
                    },
                },
                {
                    label: i18n.t('menu.edit.redo'),
                    accelerator: process.platform === 'darwin' ? 'Shift+CmdOrCtrl+Z' : 'CmdOrCtrl+Y',
                    click: function () {
                        sendToFrontend(BrowserWindow.getFocusedWindow(), 'redo');
                    },
                },
                { type: 'separator' },
                { label: i18n.t('menu.edit.cut'), accelerator: 'CmdOrCtrl+X', role: 'cut' },
                { label: i18n.t('menu.edit.copy'), accelerator: 'CmdOrCtrl+C', role: 'copy' },
                { label: i18n.t('menu.edit.paste'), accelerator: 'CmdOrCtrl+V', role: 'paste' },
                { label: i18n.t('menu.edit.selectAll'), accelerator: 'CmdOrCtrl+A', role: 'selectAll' },
            ],
        },
        {
            label: i18n.t('menu.preview.label'),
            submenu: [
                {
                    label: i18n.t('menu.preview.start'),
                    click: function () {
                        createPreview(store.state.projects[BrowserWindow.getFocusedWindow().id].workdir);
                    },
                },
                {
                    label: i18n.t('menu.preview.global'),
                    click: function () {
                        createGlobalPreview(store.state.projects[BrowserWindow.getFocusedWindow().id].workdir);
                    },
                },
            ],
        },
        {
            label: i18n.t('menu.help.label'),
            submenu: [
                {
                    label: i18n.t('menu.help.documentation'),
                    click: async function () {
                        await shell.openExternal('https://epoc.inria.fr/guide/user/getting-started/');
                    },
                },
                {
                    label: i18n.t('menu.help.reportIssue'),
                    click: async function () {
                        const isDev = process.env.IS_DEV === 'true';

                        const emailSubject = i18n.t('menu.help.mailSubject');
                        const emailRecipient = 'ill-ePoc-contact@inria.fr';
                        let emailBody = '';
                        if (isDev) {
                            const appVersion = app.getVersion();
                            emailBody = encodeURIComponent(
                                `Version: ${appVersion}\n---\n\n${i18n.t('menu.help.mailBody')}\n\n`
                            );
                        } else {
                            const appInfo = require('../../dist/appInfo.json');
                            emailBody = encodeURIComponent(
                                `Version: ${appInfo.version}\nBuild: ${appInfo.buildNumber}\n ---\n\n${i18n.t(
                                    'menu.help.mailBody'
                                )}\n\n`
                            );
                        }

                        const mailtoLink = `mailto:${emailRecipient}?subject=${emailSubject}&body=${emailBody}`;

                        await shell.openExternal(mailtoLink);
                    },
                },
                { type: 'separator' },
                {
                    label: i18n.t('menu.devTools'),
                    accelerator: 'CmdOrCtrl+D',
                    click: function () {
                        BrowserWindow.getFocusedWindow().webContents.toggleDevTools();
                    },
                },
                {
                    label: i18n.t('menu.reload'),
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

module.exports = {
    createMainWindow,
    setupWindow,
    createNewWindow,
};

const changeLanguage = (lng) => {
    i18n.changeLanguage(lng, (err) => {
        if (err) {
            console.error('Error changing language:', err);
            return;
        }
        // Save language preference
        electronStore.set('language', lng);
        // Refresh the menu
        setupMenu();
    });
};

// Initialize language from store
const storedLanguage = electronStore.get('language');
if (storedLanguage) {
    i18n.changeLanguage(storedLanguage);
}
