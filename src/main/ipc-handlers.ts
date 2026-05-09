import { ipcMain } from 'electron';
import { sendNotification } from './notification';
import { getMainWindow } from './window';

export function registerIpcHandlers(): void {
  ipcMain.handle('pomodoro:notification', (_event, title: string, body: string) => {
    sendNotification(title, body);
  });

  ipcMain.handle('pomodoro:setAlwaysOnTop', (_event, flag: boolean) => {
    const win = getMainWindow();
    if (win) {
      win.setAlwaysOnTop(flag);
    }
  });
}
