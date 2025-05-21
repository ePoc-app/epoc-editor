const path = require('path');
const store = require('./store');
const { ipcMain } = require('electron');
const { updatePreview, createPreview } = require('./preview');
const {
    getRecentFiles,
    pickEpocProject,
    openEpocProject,
    newEpocProject,
    saveEpocProject,
    exportProject,
    writeProjectData,
    writeEpocData,
    readProjectData,
    copyFileToWorkdir,
} = require('./file');
const { Menu } = require('electron');
const contextMenu = require('./contextMenu');
const Store = require('electron-store');
const electronStore = new Store();

const { app } = require('electron');

const copyData = {
    pages: null,
    chapter: null,
    sourceId: null,
    edges: null,
};

/**
 * Setup ipc listeners that are received from renderer process
 * @param targetWindow
 */
const setupIpcListener = function (targetWindow, setupMenu) {
    function ipcGuard(handler) {
        return (event, ...args) => {
            if (targetWindow.isDestroyed() || event.sender !== targetWindow.webContents) return;
            handler(event, ...args);
        };
    }

    ipcMain.on(
        'getRecentProjects',
        ipcGuard((event) => {
            sendToFrontend(event.sender, 'getRecentProjects', getRecentFiles());
        }),
    );

    ipcMain.on(
        'getCurrentProject',
        ipcGuard(async (event) => {
            if (store.state.projects[targetWindow.id] && store.state.projects[targetWindow.id].workdir) {
                const flow = await readProjectData(store.state.projects[targetWindow.id].workdir);
                sendToFrontend(event.sender, 'epocProjectReady', {
                    project: store.state.projects[targetWindow.id],
                    flow,
                });
            }
        }),
    );

    ipcMain.on(
        'pickEpocProject',
        ipcGuard((event) => {
            sendToFrontend(event.sender, 'epocProjectPicked', pickEpocProject());
        }),
    );

    ipcMain.on(
        'openEpocProject',
        ipcGuard(async (event, epocProjectPath) => {
            const { project, imported } = await openEpocProject(epocProjectPath);
            if (!project) {
                sendToFrontend(event.sender, 'epocProjectError');
                return;
            }

            if (imported) {
                sendToFrontend(event.sender, 'importRequired', project);
            } else {
                const flow = await readProjectData(project.workdir);
                sendToFrontend(event.sender, 'epocProjectReady', { project, flow });
                store.updateState('projects', { [targetWindow.id]: project });
            }
        }),
    );

    ipcMain.on(
        'newEpocProject',
        ipcGuard(async (event) => {
            const project = await newEpocProject();
            sendToFrontend(event.sender, 'epocProjectReady', { project });
            store.updateState('projects', { [targetWindow.id]: project });
        }),
    );

    ipcMain.on(
        'saveEpocProject',
        ipcGuard(async (event, data) => {
            sendToFrontend(event.sender, 'epocProjectSaving');

            const { data: projectData, content } = data;
            await writeProjectData(store.state.projects[targetWindow.id].workdir, projectData);
            await writeEpocData(store.state.projects[targetWindow.id].workdir, content);

            updateSavedProject(event.sender, await saveEpocProject(store.state.projects[targetWindow.id]));
        }),
    );

    ipcMain.on(
        'runPreview',
        ipcGuard(async (event, data) => {
            try {
                const { contentPath, projectJSON } = data;
                const { data: projectData, content } = projectJSON;
                await writeProjectData(store.state.projects[targetWindow.id].workdir, projectData);
                await writeEpocData(store.state.projects[targetWindow.id].workdir, content);

                await createPreview(store.state.projects[targetWindow.id].workdir, contentPath);
                sendToFrontend(event.sender, 'previewReady');
            } catch (e) {
                console.error(e);
                sendToFrontend(event.sender, 'previewError');
            }
        }),
    );

    ipcMain.on(
        'exportProject',
        ipcGuard(async (event, data) => {
            try {
                const { data: projectData, content } = data;
                await writeProjectData(store.state.projects[targetWindow.id].workdir, projectData);
                await writeEpocData(store.state.projects[targetWindow.id].workdir, content);

                await exportProject(
                    store.state.projects[targetWindow.id].workdir,
                    store.state.projects[targetWindow.id].filepath,
                );
                sendToFrontend(event.sender, 'projectExported');
            } catch (e) {
                console.error(e);
                sendToFrontend(event.sender, 'exportError');
            }
        }),
    );

    ipcMain.on(
        'writeProjectData',
        ipcGuard(async (event, data) => {
            await writeProjectData(store.state.projects[targetWindow.id].workdir, data);
        }),
    );

    ipcMain.on(
        'writeEpocData',
        ipcGuard(async (event, data) => {
            await writeEpocData(store.state.projects[targetWindow.id].workdir, data);
            updatePreview();
        }),
    );

    ipcMain.on(
        'importFile',
        ipcGuard(async (event, data) => {
            const { filepath, targetDirectory } = data;
            sendToFrontend(
                event.sender,
                'fileImported',
                await copyFileToWorkdir(store.state.projects[targetWindow.id].workdir, filepath, targetDirectory),
            );
        }),
    );

    ipcMain.on(
        'graphCopy',
        ipcGuard(async (event, data) => {
            const parsedData = JSON.parse(data);
            const { pages, edges, chapter } = parsedData;

            copyData.pages = pages;
            copyData.chapter = chapter || null;
            copyData.edges = edges;
            copyData.sourceId = targetWindow.id;
        }),
    );

    ipcMain.on(
        'graphPaste',
        ipcGuard(async (event, data) => {
            if (!copyData.pages) return;

            const parsedData = JSON.parse(data);
            const { position } = parsedData;

            if (copyData.sourceId !== targetWindow.id) {
                const assets = detectAssets(copyData.pages);
                for (const asset of assets) {
                    const assetPath = path.join(store.state.projects[copyData.sourceId].workdir, asset);
                    await copyFileToWorkdir(store.state.projects[targetWindow.id].workdir, assetPath);
                }
            }

            sendToFrontend(event.sender, 'graphPasted', {
                selectedPages: copyData.pages,
                selectedEdges: copyData.edges,
                position,
                chapter: copyData.chapter,
            });

            copyData.pages = null;
            copyData.chapter = null;
            copyData.edges = null;
            copyData.sourceId = null;
        }),
    );

    ipcMain.on(
        'contextMenu',
        ipcGuard(async (event, data) => {
            const popupMenu = Menu.buildFromTemplate(contextMenu.getTemplateFromContext(sendToFrontend, data));
            popupMenu.popup(targetWindow.webContents);

            popupMenu.on('menu-will-close', () => {
                sendToFrontend(targetWindow.webContents, 'contextMenuClosed');
            });
        }),
    );

    ipcMain.on(
        'getEditorVersion',
        ipcGuard(async (event) => {
            sendToFrontend(event.sender, 'editorVersion', { version: app.getVersion() });
        }),
    );

    ipcMain.on(
        'getPlatform',
        ipcGuard(async (event) => {
            sendToFrontend(event.sender, 'platform', { platform: process.platform });
        }),
    );

    ipcMain.on(
        'getSettings',
        ipcGuard(async (event) => {
            let settings = electronStore.get('settings');
            if (!settings?.locale) {
                settings = { ...settings, locale: app.getPreferredSystemLanguages()[0].split('-')[0] };
            }
            sendToFrontend(event.sender, 'settings', { settings });
        }),
    );

    ipcMain.on(
        'setSettings',
        ipcGuard(async (_event, data) => {
            const settings = electronStore.get('settings') || {};
            const { spellcheck, locale } = settings;
            electronStore.set('settings', data);

            if (data.spellcheck !== spellcheck) {
                targetWindow.webContents.session.setSpellCheckerEnabled(spellcheck);
                targetWindow.webContents.reload();
            }

            if (data.locale !== locale) {
                setupMenu();
                targetWindow.webContents.reload();
            }
        }),
    );
};

const sendToFrontend = function (webContents, channel, data) {
    if (typeof data === 'string') {
        webContents.send(channel, data);
    } else {
        webContents.send(channel, JSON.stringify(data));
    }
};

const updateSavedProject = function (webContents, filepath) {
    if (filepath) {
        const project = {
            name: path.basename(filepath),
            filepath: filepath,
            workdir: store.state.projects[webContents.id].workdir,
            modified: new Date().toISOString(),
        };
        store.updateState('projects', { [webContents.id]: project });
        sendToFrontend(webContents, 'epocProjectSaved', project);
    }
};

/**
 * Detect & return all assets paths from a given data
 * @param data
 * @returns {String[]}
 */
const detectAssets = function (data) {
    if (!data) return;

    const formValues = [];
    for (const page of data) {
        for (const element of page.data.elements) {
            formValues.push(element.formValues);
        }
    }

    const regex = /assets\/[^"\\]*/g;
    const assetPaths = [];
    const jsonFormValues = JSON.stringify(formValues);
    const matches = jsonFormValues.matchAll(regex);
    for (const match of matches) {
        const path = match[0];
        if (!assetPaths.includes(path)) {
            assetPaths.push(path);
        }
    }

    return assetPaths;
};

module.exports = {
    setupIpcListener,
    sendToFrontend,
    updateSavedProject,
};
