import { TimerState } from '../../shared/types';

export class Timer {
  remainingSeconds: number;
  totalSeconds: number;
  state: TimerState = 'idle';

  private intervalId: ReturnType<typeof setInterval> | null = null;
  private tickCallbacks: Array<(remaining: number, total: number) => void> = [];
  private completeCallbacks: Array<() => void> = [];
  private startTimestamp = 0;
  private elapsedBeforePause = 0;

  constructor(totalSeconds: number) {
    this.totalSeconds = totalSeconds;
    this.remainingSeconds = totalSeconds;
  }

  setDuration(totalSeconds: number): void {
    this.totalSeconds = totalSeconds;
    if (this.state === 'idle') {
      this.remainingSeconds = totalSeconds;
    }
  }

  start(): void {
    if (this.state === 'running') return;

    if (this.state === 'idle') {
      this.remainingSeconds = this.totalSeconds;
      this.elapsedBeforePause = 0;
    }

    this.state = 'running';
    this.startTimestamp = Date.now();

    this.intervalId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTimestamp) / 1000);
      const totalElapsed = this.elapsedBeforePause + elapsed;
      this.remainingSeconds = Math.max(0, this.totalSeconds - totalElapsed);

      this.tickCallbacks.forEach((cb) => cb(this.remainingSeconds, this.totalSeconds));

      if (this.remainingSeconds <= 0) {
        this.stop();
        this.state = 'idle';
        this.completeCallbacks.forEach((cb) => cb());
      }
    }, 200);
  }

  pause(): void {
    if (this.state !== 'running') return;
    const elapsed = Math.floor((Date.now() - this.startTimestamp) / 1000);
    this.elapsedBeforePause += elapsed;
    this.stop();
    this.state = 'paused';
    this.tickCallbacks.forEach((cb) => cb(this.remainingSeconds, this.totalSeconds));
  }

  reset(): void {
    this.stop();
    this.state = 'idle';
    this.remainingSeconds = this.totalSeconds;
    this.elapsedBeforePause = 0;
    this.tickCallbacks.forEach((cb) => cb(this.remainingSeconds, this.totalSeconds));
  }

  onTick(cb: (remaining: number, total: number) => void): void {
    this.tickCallbacks.push(cb);
  }

  onComplete(cb: () => void): void {
    this.completeCallbacks.push(cb);
  }

  private stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
