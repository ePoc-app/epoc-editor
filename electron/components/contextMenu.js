// const { Menu } = require('electron');
// const { BrowserWindow } = require('electron');
// const { sendToFrontend } = require('./ipc');

// const { screen } = require('electron');

// const contextTemplate = [
//     {
//         label: 'Ajouter',
//         submenu: [
//             {
//                 label: 'Ajouter du texte',
//                 click: () => { sendToFrontend(BrowserWindow.getFocusedWindow(),'addPage', { type: 'text', pos: getRelativeCursorPosition() }); }
//             },
//             {
//                 label: 'Ajouter une vidéo',
//                 click: () => { sendToFrontend(BrowserWindow.getFocusedWindow(), 'addPage', { type: 'video', pos: getRelativeCursorPosition() }); }
//             }
//         ]
//     },
// ];

// function getRelativeCursorPosition() {
//     const cursorPosition = screen.getCursorScreenPoint();
//     // Get the position of the current window
//     const windowPosition = BrowserWindow.getFocusedWindow().getPosition();

//     // Calculate the cursor position relative to the current window
//     const cursorPositionRelativeToWindow = {
//         x: cursorPosition.x - windowPosition[0],
//         y: cursorPosition.y - windowPosition[1]
//     };

//     return cursorPositionRelativeToWindow;  
// }

//? the context menu is currently disabled
// module.exports.popupMenu = Menu.buildFromTemplate(contextTemplate);