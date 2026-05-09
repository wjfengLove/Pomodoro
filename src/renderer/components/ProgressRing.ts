export class ProgressRing {
  private circle: SVGCircleElement;
  private circumference: number;

  constructor(container: HTMLElement) {
    const radius = 110;
    this.circumference = 2 * Math.PI * radius;
    const size = 260;
    const center = size / 2;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'progress-ring');
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);

    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bg.setAttribute('class', 'progress-ring__bg');
    bg.setAttribute('cx', String(center));
    bg.setAttribute('cy', String(center));
    bg.setAttribute('r', String(radius));
    bg.setAttribute('stroke-width', '6');
    svg.appendChild(bg);

    const fill = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    fill.setAttribute('class', 'progress-ring__fill');
    fill.setAttribute('cx', String(center));
    fill.setAttribute('cy', String(center));
    fill.setAttribute('r', String(radius));
    fill.setAttribute('stroke-width', '6');
    fill.setAttribute('stroke-dasharray', String(this.circumference));
    fill.setAttribute('stroke-dashoffset', '0');
    svg.appendChild(fill);

    container.appendChild(svg);
    this.circle = fill;
  }

  update(remaining: number, total: number, isBreak: boolean): void {
    const fraction = remaining / total;
    const offset = this.circumference * (1 - fraction);
    this.circle.style.strokeDashoffset = String(offset);

    if (isBreak) {
      this.circle.classList.add('break');
    } else {
      this.circle.classList.remove('break');
    }
  }
}
