import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  effect,
  input,
} from '@angular/core';
import { InfoTooltipComponent } from '../../../../shared/components/info-tooltip/info-tooltip.component';
import {
  Chart,
  ChartConfiguration,
  Filler,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { KpiTone } from '../../dashboard.model';

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Filler, Tooltip);

const TONE_BG: Record<KpiTone, string> = {
  primary: 'linear-gradient(135deg, #1B4F8A 0%, #2a6cb8 100%)',
  info: 'linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)',
  success: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
  warning: 'linear-gradient(135deg, #E65100 0%, #FFB74D 100%)',
  danger: 'linear-gradient(135deg, #B71C1C 0%, #EF5350 100%)',
  accent: 'linear-gradient(135deg, #6A1B9A 0%, #AB47BC 100%)',
};

@Component({
  selector: 'app-kpi-stat-card',
  standalone: true,
  imports: [InfoTooltipComponent],
  template: `
    <article
      class="kpi"
      [style.background]="bg()"
      [attr.aria-label]="ariaLabel()">
      <header class="kpi__head">
        <span class="kpi__title">{{ title() }}</span>
        <span class="kpi__head-right">
          @if (infoText()) {
            <app-info-tooltip [text]="infoText()" color="rgba(255,255,255,0.75)"></app-info-tooltip>
          }
          @if (deltaPct() !== null) {
            <span class="kpi__delta" [class.kpi__delta--neg]="deltaPct()! < 0">
              <span aria-hidden="true">{{ deltaPct()! >= 0 ? '▲' : '▼' }}</span>
              {{ formatDelta(deltaPct()!) }}
            </span>
          }
        </span>
      </header>

      @if (secondaryValue()) {
        <div class="kpi__metrics">
          <div class="kpi__metric">
            <div class="kpi__value">{{ value() }}</div>
            <div class="kpi__metric-label">{{ valueLabel() }}</div>
          </div>
          <div class="kpi__metric">
            <div class="kpi__value">{{ secondaryValue() }}</div>
            <div class="kpi__metric-label">{{ secondaryLabel() }}</div>
          </div>
        </div>
      } @else {
        <div class="kpi__value-row">
          <div class="kpi__value">{{ value() }}</div>
          <span class="kpi__action-hint" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Mais detalhes
          </span>
        </div>
      }

      @if (hint()) {
        <div class="kpi__hint">{{ hint() }}</div>
      }
      <div class="kpi__spark">
        <canvas #spark></canvas>
      </div>
    </article>
  `,
  styles: [`
    /* :host vira flex para que o <article> preencha 100% da célula do grid,
       fazendo todos os cards terem a mesma altura. */
    :host { display: flex; }
    .kpi {
      position: relative;
      color: #fff;
      border-radius: 14px;
      /* padding-bottom: 0 → o sparkline cola na base do card. */
      padding: 16px 18px 0;
      min-height: 132px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
      overflow: hidden;
      box-shadow: 0 6px 18px rgba(15, 51, 96, 0.12);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .kpi:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(15, 51, 96, 0.18); cursor: pointer; }
    .kpi:hover .kpi__action-hint { opacity: 0.85; transform: translateY(0); }
    .kpi__head { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
    .kpi__head-right { display: flex; align-items: center; gap: 6px; }
    .kpi__title {
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      opacity: 0.95;
    }
    .kpi__delta {
      font-size: 0.72rem;
      font-weight: 600;
      background: rgba(255, 255, 255, 0.18);
      padding: 2px 8px;
      border-radius: 999px;
      white-space: nowrap;
    }
    .kpi__delta--neg { background: rgba(0, 0, 0, 0.25); }
    .kpi__value-row { display: flex; justify-content: space-between; align-items: flex-end; }
    .kpi__action-hint {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.72rem;
      opacity: 0;
      transform: translateY(4px);
      transition: all 0.2s ease;
    }
    .kpi__value {
      font-size: 1.9rem;
      font-weight: 700;
      line-height: 1.15;
      font-variant-numeric: tabular-nums;
    }
    /* Métricas lado a lado — ambos os valores compartilham .kpi__value
       (mesmo tamanho e peso). Separação só pelo gap do flex, sem divisores. */
    .kpi__metrics {
      display: flex;
      align-items: flex-end;
      gap: 28px;
    }
    .kpi__metric { display: flex; flex-direction: column; min-width: 0; }
    .kpi__metric-label {
      font-size: 0.7rem;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      opacity: 0.78;
      margin-top: 4px;
    }
    .kpi__hint {
      font-size: 0.78rem;
      opacity: 0.85;
      margin-top: 8px;
    }
    .kpi__spark {
      position: relative;
      height: 36px;
      margin-top: auto;
    }
    .kpi__spark canvas { position: absolute; inset: 0; }
  `],
})
export class KpiStatCardComponent implements AfterViewInit, OnDestroy {
  title = input.required<string>();
  value = input.required<string>();
  /** Rótulo da métrica principal (ex.: "Usuários"). Exibido apenas no modo dual. */
  valueLabel = input<string>('');
  /** Métrica secundária opcional. Quando preenchida, o card adota o layout de duas colunas. */
  secondaryValue = input<string>('');
  /** Rótulo da métrica secundária (ex.: "Perfis"). */
  secondaryLabel = input<string>('');
  deltaPct = input<number | null>(null);
  sparkline = input<number[]>([]);
  tone = input<KpiTone>('primary');
  hint     = input<string>('');
  infoText = input<string>('');

  @ViewChild('spark') sparkRef?: ElementRef<HTMLCanvasElement>;
  private chart?: Chart<'line'>;

  constructor() {
    effect(() => {
      // Keep a reactive dependency on sparkline to force redraws.
      this.sparkline();
      this.tone();
      queueMicrotask(() => this.renderChart());
    });
  }

  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  bg(): string {
    return TONE_BG[this.tone()];
  }

  ariaLabel(): string {
    const base = `${this.title()}, ${this.valueLabel() || 'valor'} ${this.value()}`;
    return this.secondaryValue()
      ? `${base}, ${this.secondaryLabel()} ${this.secondaryValue()}`
      : base;
  }

  formatDelta(v: number): string {
    const sign = v > 0 ? '+' : '';
    return `${sign}${v.toFixed(1).replace('.', ',')}%`;
  }

  private renderChart(): void {
    if (!this.sparkRef) return;
    const data = this.sparkline();
    if (!data.length) return;

    if (this.chart) {
      this.chart.data.labels = data.map((_, i) => String(i));
      this.chart.data.datasets[0].data = [...data];
      this.chart.update('none');
      return;
    }

    const cfg: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: data.map((_, i) => String(i)),
        datasets: [
          {
            data: [...data],
            borderColor: 'rgba(255,255,255,0.95)',
            backgroundColor: 'rgba(255,255,255,0.25)',
            fill: true,
            tension: 0.35,
            pointRadius: 0,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
          x: { display: false },
          y: { display: false },
        },
        elements: { line: { capBezierPoints: true } },
      },
    };
    this.chart = new Chart(this.sparkRef.nativeElement, cfg);
  }
}
