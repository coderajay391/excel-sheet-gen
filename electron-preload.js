// Offline Excel Guider - Context Bridge Preload
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform, // 'win32', 'darwin', or 'linux'
  isDesktop: true,
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-action', (_event, action) => callback(action));
  }
});
