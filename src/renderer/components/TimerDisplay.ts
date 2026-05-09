import { formatTime } from '../utils/format';

export class TimerDisplay {
  private el: HTMLElement;

  constructor(container: HTMLElement) {
    this.el = document.createElement('div');
    this.el.className = 'timer-display';
    this.el.textContent = '25:00';
    container.appendChild(this.el);
  }

  update(remaining: number): void {
    this.el.textContent = formatTime(remaining);
  }
}
