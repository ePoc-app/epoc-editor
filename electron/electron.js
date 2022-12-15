/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { app, BrowserWindow,dialog, Menu, ipcMain } = require('electron');
const fs = require('fs');

const isDev = process.env.IS_DEV === 'true' ? true : false;

let mainWindow;

ipcMain.on('msg', (event, data) => {
    console.log(data);
});

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        icon: 'favicon.png',
        width: 800,
        height: 800,
        'minHeight': 800,
        'minWidth': 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // load the index.html of the app.
    mainWindow.loadURL(
        isDev
            ? 'http://localhost:8000'
            : `file://${path.join(__dirname, '../dist/index.html')}`
    );

    // Open the DevTools.
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open File',
                    accelerator: 'CmdOrCtrl+O',
                    click() {
                        openFile();
                    }
                }
            ]
        },
        {
            label: 'Developer',
            submenu: [
                {
                    label: 'Open DevTools',
                    accelerator: 'CmdOrCtrl+Shift+I',
                    click() {
                        mainWindow.webContents.openDevTools();
                    }
                }
            ],
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished initialization and is ready to create browser windows.
app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all the window are closed, except on macOS. There, it's common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
});

function openFile() {
    const files = dialog.showOpenDialogSync(mainWindow, {
        properties: ['openFile'],
        filters: [{ name: 'Markdown', extensions: ['md', 'markdown', 'txt']}]
    });
    if(!files) return;

    const file = files[0];
    const fileContent = fs.readFileSync(file).toString();
    console.log(fileContent);

    mainWindow.webContents.send('fromMain', fileContent);
}

ipcMain.on('toMain', (event, data) => {
    console.log(data);
});