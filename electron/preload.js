const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    send: (channel, data) => {
        // // @todo Whitelist channels
        // let validChannels = ['toMain', 'getRecentProjects', 'openEpocProject', 'unzipEpocProject'];
        // if(validChannels.includes(channel)) {
        //     ipcRenderer.send(channel, data);
        // }
        ipcRenderer.send(channel, data);
    },
    receive: (channel, func) => {
        // // @todo Whitelist channels
        // let validChannels = ['fromMain', 'getRecentProjects', 'epocProjectOpened', 'epocProjectReady'];
        // if(validChannels.includes(channel)) {
        //     // Deliberately strip event as it includes `sender`
        //     ipcRenderer.on(channel, (event, ...args) => func(...args));
        // }
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
    receiveOnce: (channel, func) => {
        // // @todo Whitelist channels
        // let validChannels = ['fromMain', 'getRecentProjects', 'epocProjectOpened', 'epocProjectReady'];
        // if(validChannels.includes(channel)) {
        //     // Deliberately strip event as it includes `sender`
        //     ipcRenderer.on(channel, (event, ...args) => func(...args));
        // }
        ipcRenderer.once(channel, (event, ...args) => func(...args));
    },
});

contextBridge.exposeInMainWorld('env', {
    isDev: process.env.IS_DEV === 'true',
});
