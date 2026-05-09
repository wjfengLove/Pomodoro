import { TimerPhase, PomodoroSettings } from '../../shared/types';
import { Timer } from '../core/Timer';
import { PomodoroCycle } from '../core/PomodoroCycle';
import { loadSettings, saveSettings } from '../core/Settings';
import { ProgressRing } from './ProgressRing';
import { TimerDisplay } from './TimerDisplay';
import { Controls } from './Controls';
import { SessionIndicator } from './SessionIndicator';
import { SettingsPanel } from './SettingsPanel';

export class App {
  private settings: PomodoroSettings;
  private cycle: PomodoroCycle;
  private timer: Timer;
  private ui!: {
    session: SessionIndicator;
    ring: ProgressRing;
    display: TimerDisplay;
    controls: Controls;
    settingsPanel: SettingsPanel;
  };

  constructor(container: HTMLElement) {
    this.settings = loadSettings();
    this.cycle = new PomodoroCycle(this.settings);
    this.timer = new Timer(this.cycle.getCurrentDuration());

    this.buildUI(container);
    this.bindTimer();
    this.bindCycle();
  }

  private buildUI(container: HTMLElement): void {
    container.className = 'app';

    // Wrap ring + display in a shared container so they overlap
    const timerContainer = document.createElement('div');
    timerContainer.className = 'timer-container';
    container.appendChild(timerContainer);

    this.ui = {
      session: new SessionIndicator(container),
      ring: new ProgressRing(timerContainer),
      display: new TimerDisplay(timerContainer),
      controls: new Controls(container),
      settingsPanel: new SettingsPanel(container, this.settings),
    };

    // Bottom bar
    const bottomBar = document.createElement('div');
    bottomBar.className = 'bottom-bar';

    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'icon-btn';
    settingsBtn.textContent = '⚙';
    settingsBtn.title = '设置';
    settingsBtn.addEventListener('click', () => this.ui.settingsPanel.toggle());

    const pinBtn = document.createElement('button');
    pinBtn.className = 'icon-btn';
    pinBtn.textContent = '\u{1F4CC}';
    pinBtn.title = '始终置顶';
    if (this.settings.alwaysOnTop) pinBtn.classList.add('active');
    pinBtn.addEventListener('click', () => {
      this.settings.alwaysOnTop = !this.settings.alwaysOnTop;
      pinBtn.classList.toggle('active', this.settings.alwaysOnTop);
      saveSettings(this.settings);
      window.pomodoroAPI?.setAlwaysOnTop(this.settings.alwaysOnTop);
    });

    const countLabel = document.createElement('span');
    countLabel.className = 'pomodoro-count';
    countLabel.textContent = `\u{1F345} × ${this.cycle.completedCount}`;

    bottomBar.appendChild(settingsBtn);
    bottomBar.appendChild(pinBtn);
    bottomBar.appendChild(countLabel);
    container.appendChild(bottomBar);

    // Apply initial alwaysOnTop
    if (this.settings.alwaysOnTop) {
      window.pomodoroAPI?.setAlwaysOnTop(true);
    }

    this.ui.settingsPanel.setOnSettingsChange((s) => {
      this.settings.workDuration = s.workDuration;
      this.settings.breakDuration = s.breakDuration;
      saveSettings(this.settings);
      this.cycle.updateSettings(this.settings);
      if (this.timer.state === 'idle') {
        this.timer.setDuration(this.cycle.getCurrentDuration());
        this.timer.reset();
      }
    });
  }

  private bindTimer(): void {
    this.timer.onTick((remaining, total) => {
      this.ui.display.update(remaining);
      this.ui.ring.update(remaining, total, this.cycle.phase === 'break');
    });

    this.timer.onComplete(() => {
      const isWork = this.cycle.phase === 'work';
      const title = isWork ? '工作完成！' : '休息结束！';
      const body = isWork ? '该休息一下了' : '开始下一个番茄吧';
      window.pomodoroAPI?.sendNotification(title, body);

      this.cycle.switchPhase();
      this.timer.setDuration(this.cycle.getCurrentDuration());
      this.timer.start();

      this.ui.controls.updateState(this.timer.state);
      this.updatePomodoroCount();
    });

    this.ui.controls.setOnStartPause(() => {
      switch (this.timer.state) {
        case 'idle':
        case 'paused':
          this.timer.start();
          break;
        case 'running':
          this.timer.pause();
          break;
      }
      this.ui.controls.updateState(this.timer.state);
    });

    this.ui.controls.setOnReset(() => {
      this.timer.reset();
      this.ui.controls.updateState(this.timer.state);
      this.ui.display.update(this.timer.remainingSeconds);
      this.ui.ring.update(
        this.timer.remainingSeconds,
        this.timer.totalSeconds,
        this.cycle.phase === 'break'
      );
    });
  }

  private bindCycle(): void {
    this.cycle.onPhaseChange((phase: TimerPhase) => {
      this.ui.session.update(phase);
    });
  }

  private updatePomodoroCount(): void {
    const el = document.querySelector('.pomodoro-count');
    if (el) {
      el.textContent = `\u{1F345} × ${this.cycle.completedCount}`;
    }
  }
}
