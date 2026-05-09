import { TimerState } from '../../shared/types';

export class Controls {
  private el: HTMLElement;
  private startBtn!: HTMLButtonElement;
  private resetBtn!: HTMLButtonElement;

  private onStartPause: (() => void) | null = null;
  private onReset: (() => void) | null = null;

  constructor(container: HTMLElement) {
    this.el = document.createElement('div');
    this.el.className = 'controls';

    this.startBtn = document.createElement('button');
    this.startBtn.className = 'btn btn-primary';
    this.startBtn.textContent = '开始';

    this.resetBtn = document.createElement('button');
    this.resetBtn.className = 'btn btn-secondary';
    this.resetBtn.textContent = '重置';

    this.el.appendChild(this.startBtn);
    this.el.appendChild(this.resetBtn);
    container.appendChild(this.el);

    this.startBtn.addEventListener('click', () => this.onStartPause?.());
    this.resetBtn.addEventListener('click', () => this.onReset?.());
  }

  updateState(state: TimerState): void {
    switch (state) {
      case 'idle':
        this.startBtn.textContent = '开始';
        break;
      case 'running':
        this.startBtn.textContent = '暂停';
        break;
      case 'paused':
        this.startBtn.textContent = '继续';
        break;
    }
  }

  setOnStartPause(cb: () => void): void { this.onStartPause = cb; }
  setOnReset(cb: () => void): void { this.onReset = cb; }
}
