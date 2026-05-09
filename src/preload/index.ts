import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('pomodoroAPI', {
  sendNotification: (title: string, body: string): Promise<void> =>
    ipcRenderer.invoke('pomodoro:notification', title, body),
  setAlwaysOnTop: (flag: boolean): Promise<void> =>
    ipcRenderer.invoke('pomodoro:setAlwaysOnTop', flag),
});
