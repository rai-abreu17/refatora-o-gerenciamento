import { Component, computed, input, output } from '@angular/core';
import { HeatmapCell } from '../../dashboard.model';
import { InfoTooltipComponent } from '../../../../shared/components/info-tooltip/info-tooltip.component';

const DIA_LABEL = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const HORAS = Array.from({ length: 24 }, (_, i) => i);

@Component({
  selector: 'app-login-heatmap',
  standalone: true,
  imports: [InfoTooltipComponent],
  templateUrl: './login-heatmap.component.html',
  styleUrl: './login-heatmap.component.scss',
})
export class LoginHeatmapComponent {
  cells = input.required<HeatmapCell[]>();
  cellClick = output<{dia: number, hora: number, count: number}>();

  readonly diasLabel = DIA_LABEL;
  readonly horas = HORAS;

  private maxCount = computed(() => {
    const cells = this.cells();
    return cells.reduce((m, c) => Math.max(m, c.count), 1);
  });

  maxSample(): number {
    return this.maxCount();
  }

  private grid = computed(() => {
    const map = new Map<string, HeatmapCell>();
    for (const c of this.cells()) map.set(`${c.dia}-${c.hora}`, c);
    return map;
  });

  peakLabel = computed(() => {
    const cells = this.cells();
    if (!cells.length) return '';
    const max = cells.reduce((m, c) => (c.count > m.count ? c : m), cells[0]);
    return `${this.diasLabel[max.dia]} às ${max.hora.toString().padStart(2, '0')}h · ${max.count.toLocaleString('pt-BR')} logins`;
  });

  getCell(dia: number, hora: number): HeatmapCell | undefined {
    return this.grid().get(`${dia}-${hora}`);
  }

  intensity(count: number): number {
    const max = this.maxCount();
    if (max <= 0) return 0;
    return count / max;
  }

  cellColor(count: number): string {
    const t = this.intensity(count);
    if (t === 0) return 'rgba(27, 79, 138, 0.04)';
    // Sequential blue scale
    const alpha = 0.08 + t * 0.87;
    return `rgba(27, 79, 138, ${alpha.toFixed(3)})`;
  }

  cellTitle(dia: number, hora: number): string {
    const c = this.getCell(dia, hora);
    const count = c?.count ?? 0;
    return `${this.diasLabel[dia]} · ${hora.toString().padStart(2, '0')}h: ${count.toLocaleString('pt-BR')} logins`;
  }

  onCellClick(dia: number, hora: number): void {
    const c = this.getCell(dia, hora);
    if (c && c.count > 0) {
      this.cellClick.emit({dia, hora, count: c.count});
    }
  }

  showHourLabel(h: number): boolean {
    return h % 3 === 0;
  }
}
