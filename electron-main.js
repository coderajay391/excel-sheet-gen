// Offline Excel Guider - Electron Desktop Main Process
// Supports Windows (.exe), macOS (.dmg / .app), and Linux (.AppImage / .deb)
const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 880,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#0F172A',
    title: 'Offline Excel Guider',
    webPreferences: {
      preload: path.join(__dirname, 'electron-preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
    icon: path.join(__dirname, 'public/favicon.ico')
  });

  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, 'out/index.html')}`;
  mainWindow.loadURL(startUrl);

  // Cross-platform native window menus
  const template = [
    {
      label: 'File',
      submenu: [
        { label: 'New Project', accelerator: 'CmdOrCtrl+N', click: () => mainWindow.webContents.send('menu-action', 'new-project') },
        { label: 'Export to Excel (.xlsx)', accelerator: 'CmdOrCtrl+S', click: () => mainWindow.webContents.send('menu-action', 'export-xlsx') },
        { label: 'Export to CSV', accelerator: 'CmdOrCtrl+Shift+S', click: () => mainWindow.webContents.send('menu-action', 'export-csv') },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Formula Encyclopedia',
          click: () => mainWindow.webContents.send('menu-action', 'open-formulas')
        },
        {
          label: 'About Offline Excel Guider',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Offline Excel Guider',
              message: 'Offline Excel Guider v1.0.0',
              detail: 'Cross-platform offline spreadsheet generator and formula architect.\nRunning 100% offline with zero internet dependency.\nCompatible with Windows, macOS, and Linux.'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
