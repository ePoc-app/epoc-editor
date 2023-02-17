/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    send: (channel, data) => {
        // Whitelist channels
        let validChannels = ['toMain', 'getRecentProjects', 'openEpocProject', 'unzipEpocProject'];
        if(validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, func) => {
        let validChannels = ['fromMain', 'getRecentProjects', 'epocProjectOpened', 'epocProjectReady'];
        if(validChannels.includes(channel)) {
            // Deliberately strip event as it includes `sender` 
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
});