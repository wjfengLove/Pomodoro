import { app } from 'electron';
import { createWindow, getMainWindow } from './window';
import { createTray } from './tray';
import { registerIpcHandlers } from './ipc-handlers';

app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();
  createTray();
});

app.on('window-all-closed', () => {
  // Keep app running in tray on all platforms
});

app.on('activate', () => {
  if (getMainWindow() === null) {
    createWindow();
  }
});
