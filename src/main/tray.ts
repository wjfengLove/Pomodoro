import { Tray, Menu, nativeImage } from 'electron';
import { getMainWindow } from './window';

let tray: Tray | null = null;

// Minimal 16x16 red circle PNG in base64
const ICON_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA' +
  'WElEQVQ4y2Ng+M9AAWBigAL4TwFmYKAAMEMswAlgCmBK8Cxg' +
  'wLIAmwUsOAsYcC1gwLSAEc0CRrQYMIIsYEJjwQQASqEJ5IOv' +
  'ywAAAABJRU5ErkJggg==';

export function createTray(): void {
  try {
    const icon = nativeImage.createFromBuffer(Buffer.from(ICON_BASE64, 'base64'));
    tray = new Tray(icon.resize({ width: 16, height: 16 }));

    const updateMenu = (): void => {
      const win = getMainWindow();
      const isVisible = win?.isVisible() ?? false;
      const isAlwaysOnTop = win?.isAlwaysOnTop() ?? false;

      const contextMenu = Menu.buildFromTemplate([
        {
          label: isVisible ? '隐藏窗口' : '显示窗口',
          click: (): void => {
            if (win) {
              isVisible ? win.hide() : win.show();
            }
          },
        },
        {
          label: '始终置顶',
          type: 'checkbox',
          checked: isAlwaysOnTop,
          click: (): void => {
            if (win) {
              win.setAlwaysOnTop(!win.isAlwaysOnTop());
            }
          },
        },
        { type: 'separator' },
        {
          label: '退出',
          click: (): void => {
            if (win) {
              win.destroy();
            }
          },
        },
      ]);

      tray!.setContextMenu(contextMenu);
    };

    tray.on('click', updateMenu);
    tray.setToolTip('Pomodoro');
    setInterval(updateMenu, 5000);
  } catch {
    // Tray not supported or icon invalid — skip silently
  }
}
