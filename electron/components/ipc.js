const path = require('path');
const store = require('./store');
const { ipcMain } = require('electron');
const { runPreview } = require('./preview');
const { getRecentFiles, pickEpocProject, openEpocProject, newEpocProject, saveEpocProject, exportProject, writeProjectData, writeEpocData, readProjectData, copyFileToWorkdir } = require('./file');

/**
 * Setup ipc listeners that are received from renderer process
 * @param targetWindow
 */
const setupIpcListener = function (targetWindow) {

    ipcMain.on('getRecentProjects', (event) => {
        if(event.sender !== targetWindow.webContents) return;
        sendToFrontend(event.sender, 'getRecentProjects', getRecentFiles());
    });

    ipcMain.on('getCurrentProject', async (event) => {
        if(event.sender !== targetWindow.webContents) return;

        if (store.state.projects[targetWindow.id] && store.state.projects[targetWindow.id].workdir) {
            const flow = await readProjectData(store.state.projects[targetWindow.id].workdir);
            sendToFrontend(event.sender, 'epocProjectReady', {project: store.state.projects[targetWindow.id], flow});
        }
    });

    ipcMain.on('pickEpocProject', (event) => {
        if(event.sender !== targetWindow.webContents) return;

        sendToFrontend(event.sender, 'epocProjectPicked', pickEpocProject());
    });

    ipcMain.on('openEpocProject', async (event, epocProjectPath) => {
        if(event.sender !== targetWindow.webContents) return;

        const project = await openEpocProject(epocProjectPath);
        if(!project) {
            sendToFrontend(event.sender, 'epocProjectError');
            return;
        }

        const flow = await readProjectData(project.workdir);
        sendToFrontend(event.sender, 'epocProjectReady', {project, flow});
        store.updateState('projects', {[targetWindow.id]: project });
    });

    ipcMain.on('newEpocProject', async (event) => {
        if(event.sender !== targetWindow.webContents) return;

        const project = await newEpocProject();
        sendToFrontend(event.sender, 'epocProjectReady', {project});
        store.updateState('projects', {[targetWindow.id]: project });
    });

    ipcMain.on('saveEpocProject', async (event) => {
        if(event.sender !== targetWindow.webContents) return;

        sendToFrontend(event.sender, 'epocProjectSaving');
        updateSavedProject(event.sender, await saveEpocProject(store.state.projects[targetWindow.id]));
    });

    ipcMain.on('runPreview', async (event, contentPath) => {
        if(event.sender !== targetWindow.webContents) return;

        try {
            await runPreview(store.state.projects[targetWindow.id].workdir, contentPath);
            sendToFrontend(event.sender, 'previewReady');
        } catch (e) {
            console.error(e);
            sendToFrontend(event.sender, 'previewError');
        }
    });

    ipcMain.on('exportProject', async (event) => {
        if(event.sender !== targetWindow.webContents) return;
        
        try {
            await exportProject(store.state.projects[targetWindow.id].workdir, store.state.projects[targetWindow.id].filepath);
            sendToFrontend(event.sender, 'projectExported');
        } catch (e) {
            console.error(e);
            sendToFrontend(event.sender, 'exportError');
        }
    });

    ipcMain.on('writeProjectData', async (event, data) => {
        if(event.sender !== targetWindow.webContents) return;

        await writeProjectData(store.state.projects[targetWindow.id].workdir, data);
    });

    ipcMain.on('writeEpocData', async (event, data) => {
        if(event.sender !== targetWindow.webContents) return;

        await writeEpocData(store.state.projects[targetWindow.id].workdir, data);
    });

    ipcMain.on('importFile', async (event, filepath) => {
        if(event.sender !== targetWindow.webContents) return;
        
        sendToFrontend(event.sender, 'fileImported', await copyFileToWorkdir(store.state.projects[targetWindow.id].workdir, filepath));
    });
};

const sendToFrontend = function(webContents, channel, data) {
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
            modified: new Date().toISOString()
        };
        store.updateState('projects', {[webContents.id]: project});
        sendToFrontend(webContents, 'epocProjectSaved', project);
    }
};

module.exports = {
    setupIpcListener,
    sendToFrontend,
    updateSavedProject
};