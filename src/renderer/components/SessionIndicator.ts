import { TimerPhase } from '../../shared/types';

export class SessionIndicator {
  private el: HTMLElement;
  private phaseSpan: HTMLElement;

  constructor(container: HTMLElement) {
    this.el = document.createElement('div');
    this.el.className = 'session-indicator';

    this.phaseSpan = document.createElement('span');
    this.phaseSpan.className = 'phase';

    this.el.appendChild(this.phaseSpan);
    container.appendChild(this.el);

    this.update('work');
  }

  update(phase: TimerPhase): void {
    this.phaseSpan.textContent = phase === 'work' ? '工作中' : '休息中';
    if (phase === 'break') {
      this.el.classList.add('break');
    } else {
      this.el.classList.remove('break');
    }
  }
}
