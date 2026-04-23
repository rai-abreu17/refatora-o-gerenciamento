import { Component, computed, input, output } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { InfoTooltipComponent } from '../../../../shared/components/info-tooltip/info-tooltip.component';
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartConfiguration,
  DoughnutController,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { DistributionSlice } from '../../dashboard.model';

Chart.register(DoughnutController, ArcElement, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export type DistributionVariant = 'donut' | 'hbar' | 'grouped-bar';

export interface GroupedSeries {
  label: string;
  data: number[];
  color: string;
}

@Component({
  selector: 'app-distribution-chart',
  standalone: true,
  imports: [BaseChartDirective, InfoTooltipComponent],
  templateUrl: './distribution-chart.component.html',
  styleUrl: './distribution-chart.component.scss',
})
export class DistributionChartComponent {
  title = input.required<string>();
  variant = input<DistributionVariant>('donut');
  slices = input<DistributionSlice[]>([]);
  categories = input<string[]>([]);
  series = input<GroupedSeries[]>([]);
  subtitle = input<string>('');
  infoText = input<string>('');
  clickable = input<boolean>(true);

  sliceClick = output<DistributionSlice>();

  total = computed(() => this.slices().reduce((s, x) => s + x.value, 0));

  chartType = computed<'doughnut' | 'bar'>(() => (this.variant() === 'donut' ? 'doughnut' : 'bar'));

  chartData = computed<ChartConfiguration<'doughnut' | 'bar'>['data']>(() => {
    const v = this.variant();
    if (v === 'donut') {
      const slices = this.slices();
      return {
        labels: slices.map((s) => s.label),
        datasets: [
          {
            data: slices.map((s) => s.value),
            backgroundColor: slices.map((s) => s.color),
            borderColor: '#fff',
            borderWidth: 2,
            hoverOffset: 6,
          },
        ],
      };
    }
    if (v === 'hbar') {
      const slices = this.slices();
      return {
        labels: slices.map((s) => s.label),
        datasets: [
          {
            data: slices.map((s) => s.value),
            backgroundColor: slices.map((s) => s.color),
            borderRadius: 6,
            barPercentage: 0.7,
            categoryPercentage: 0.8,
          },
        ],
      };
    }
    // grouped-bar
    return {
      labels: this.categories(),
      datasets: this.series().map((s) => ({
        label: s.label,
        data: s.data,
        backgroundColor: s.color,
        borderRadius: 6,
        barPercentage: 0.8,
        categoryPercentage: 0.7,
      })),
    };
  });

  chartOptions = computed<ChartConfiguration<'doughnut' | 'bar'>['options']>(() => {
    const v = this.variant();
    const base = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: { usePointStyle: true, boxWidth: 10, boxHeight: 10, padding: 16, font: { size: 11 } },
        },
        tooltip: {
          backgroundColor: '#0F3360',
          padding: 10,
          callbacks: {
            label: (ctx: { dataset: { label?: string }; parsed: number | { x: number; y: number }; label?: string }) => {
              const label = ctx.dataset.label ?? ctx.label ?? '';
              const value = typeof ctx.parsed === 'number' ? ctx.parsed : (ctx.parsed?.y ?? ctx.parsed?.x ?? 0);
              return ` ${label}: ${Number(value).toLocaleString('pt-BR')}`;
            },
          },
        },
      },
      onHover: (event: any, elements: any[]) => {
        const target = event.native?.target as HTMLElement;
        if (target) {
          target.style.cursor = elements.length ? 'pointer' : 'default';
        }
      },
      onClick: (event: any, elements: any[]) => {
        if (!elements.length) return;
        const index = elements[0].index;
        
        const v = this.variant();
        if (v === 'donut' || v === 'hbar') {
          const slice = this.slices()[index];
          if (slice) this.sliceClick.emit(slice);
        }
      },
    } satisfies ChartConfiguration<'doughnut' | 'bar'>['options'];

    if (v === 'donut') {
      return {
        ...base,
        cutout: '66%',
      };
    }
    if (v === 'hbar') {
      return {
        ...base,
        indexAxis: 'y' as const,
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: 'rgba(221,225,231,0.6)' },
            ticks: { font: { size: 11 }, color: '#5A6472' },
            border: { display: false },
          },
          y: {
            grid: { display: false },
            ticks: { font: { size: 12, weight: 500 }, color: '#1A1D23' },
            border: { display: false },
          },
        },
        plugins: { ...base.plugins, legend: { display: false } },
      };
    }
    // grouped-bar
    return {
      ...base,
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#5A6472' } },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(221,225,231,0.6)' },
          ticks: { font: { size: 11 }, color: '#5A6472' },
          border: { display: false },
        },
      },
    };
  });
}
