import { PomodoroSettings } from '../../shared/types';
import { DEFAULT_WORK_MINUTES, DEFAULT_BREAK_MINUTES } from '../../shared/constants';

const STORAGE_KEY = 'pomodoro-settings';

export function loadSettings(): PomodoroSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // corrupted data, fall through to defaults
  }
  return { workDuration: DEFAULT_WORK_MINUTES, breakDuration: DEFAULT_BREAK_MINUTES, alwaysOnTop: false };
}

export function saveSettings(settings: PomodoroSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
