export type TimerPhase = 'work' | 'break';
export type TimerState = 'idle' | 'running' | 'paused';

export interface PomodoroSettings {
  workDuration: number;
  breakDuration: number;
  alwaysOnTop: boolean;
}

export interface PomodoroAPI {
  sendNotification: (title: string, body: string) => Promise<void>;
  setAlwaysOnTop: (flag: boolean) => Promise<void>;
}

declare global {
  interface Window {
    pomodoroAPI: PomodoroAPI;
  }
}
