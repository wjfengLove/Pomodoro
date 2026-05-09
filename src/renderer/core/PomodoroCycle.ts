import { TimerPhase, PomodoroSettings } from '../../shared/types';

export class PomodoroCycle {
  phase: TimerPhase = 'work';
  completedCount = 0;
  workDuration: number;
  breakDuration: number;

  private phaseChangeCallbacks: Array<(phase: TimerPhase) => void> = [];

  constructor(settings: PomodoroSettings) {
    this.workDuration = settings.workDuration * 60;
    this.breakDuration = settings.breakDuration * 60;
  }

  updateSettings(settings: PomodoroSettings): void {
    this.workDuration = settings.workDuration * 60;
    this.breakDuration = settings.breakDuration * 60;
  }

  getCurrentDuration(): number {
    return this.phase === 'work' ? this.workDuration : this.breakDuration;
  }

  switchPhase(): void {
    if (this.phase === 'work') {
      this.completedCount++;
    }
    this.phase = this.phase === 'work' ? 'break' : 'work';
    this.phaseChangeCallbacks.forEach((cb) => cb(this.phase));
  }

  onPhaseChange(cb: (phase: TimerPhase) => void): void {
    this.phaseChangeCallbacks.push(cb);
  }
}
