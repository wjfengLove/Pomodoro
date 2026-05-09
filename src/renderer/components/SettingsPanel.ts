import { PomodoroSettings } from '../../shared/types';

export class SettingsPanel {
  private el: HTMLElement;
  private workInput: HTMLInputElement;
  private breakInput: HTMLInputElement;
  private visible = false;

  private onSettingsChange: ((s: PomodoroSettings) => void) | null = null;

  constructor(container: HTMLElement, settings: PomodoroSettings) {
    this.el = document.createElement('div');
    this.el.className = 'settings-panel';

    this.workInput = document.createElement('input');
    this.workInput.type = 'number';
    this.workInput.min = '1';
    this.workInput.max = '60';
    this.workInput.value = String(settings.workDuration);

    this.breakInput = document.createElement('input');
    this.breakInput.type = 'number';
    this.breakInput.min = '1';
    this.breakInput.max = '30';
    this.breakInput.value = String(settings.breakDuration);

    this.el.innerHTML = `
      <div class="settings-row">
        <label>工作时长</label>
        <span>
          <input type="number" min="1" max="60" value="${settings.workDuration}" data-key="work">
          <span class="unit">分钟</span>
        </span>
      </div>
      <div class="settings-row">
        <label>休息时长</label>
        <span>
          <input type="number" min="1" max="30" value="${settings.breakDuration}" data-key="break">
          <span class="unit">分钟</span>
        </span>
      </div>
    `;

    container.appendChild(this.el);

    const workInput = this.el.querySelector('[data-key="work"]') as HTMLInputElement;
    const breakInput = this.el.querySelector('[data-key="break"]') as HTMLInputElement;

    const onChange = (): void => {
      this.onSettingsChange?.({
        workDuration: parseInt(workInput.value, 10) || 25,
        breakDuration: parseInt(breakInput.value, 10) || 5,
        alwaysOnTop: false,
      });
    };

    workInput.addEventListener('change', onChange);
    breakInput.addEventListener('change', onChange);
  }

  toggle(): void {
    this.visible = !this.visible;
    this.el.classList.toggle('visible', this.visible);
  }

  setOnSettingsChange(cb: (s: PomodoroSettings) => void): void {
    this.onSettingsChange = cb;
  }
}
