import { Component, computed, input, output } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  Chart,
  ChartConfiguration,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { AccessSeriesResponse, Granularity } from '../../dashboard.model';

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler);

@Component({
  selector: 'app-trend-chart',
  standalone: true,
  imports: [BaseChartDirective, MatIconModule, MatButtonModule, MatButtonToggleModule],
  templateUrl: './trend-chart.component.html',
  styleUrl: './trend-chart.component.scss',
})
export class TrendChartComponent {
  series1G = input.required<AccessSeriesResponse>();
  series2G = input.required<AccessSeriesResponse>();
  granularity = input.required<Granularity>();
  granularityChange = output<Granularity>();

  chartData = computed<ChartConfiguration<'line'>['data']>(() => {
    const s1 = this.series1G();
    const s2 = this.series2G();
    const g = this.granularity();
    return {
      labels: s1.data.map((d) => this.formatLabel(d.period, g)),
      datasets: [
        {
          label: 'PJe 1G',
          data: s1.data.map((d) => d.count),
          borderColor: '#1B4F8A',
          backgroundColor: 'rgba(27, 79, 138, 0.15)',
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 5,
          borderWidth: 2.5,
        },
        {
          label: 'PJe 2G',
          data: s2.data.map((d) => d.count),
          borderColor: '#E8A000',
          backgroundColor: 'rgba(232, 160, 0, 0.15)',
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 5,
          borderWidth: 2.5,
        },
      ],
    };
  });

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: { usePointStyle: true, boxHeight: 8, boxWidth: 8, padding: 16, font: { size: 12, weight: 500 } },
      },
      tooltip: {
        backgroundColor: '#0F3360',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${(ctx.parsed.y ?? 0).toLocaleString('pt-BR')} acessos`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#5A6472', font: { size: 11 } } },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(221, 225, 231, 0.6)' },
        border: { display: false },
        ticks: {
          color: '#5A6472',
          font: { size: 11 },
          callback: (value) => Number(value).toLocaleString('pt-BR'),
        },
      },
    },
  };

  totals = computed(() => {
    const s1 = this.series1G();
    const s2 = this.series2G();
    return { total1G: s1.total, total2G: s2.total, combined: s1.total + s2.total };
  });

  onGranularityChange(g: Granularity): void {
    this.granularityChange.emit(g);
  }

  exportCsv(): void {
    const s1 = this.series1G();
    const s2 = this.series2G();
    const rows: string[] = ['periodo;pje_1g;pje_2g'];
    const len = Math.max(s1.data.length, s2.data.length);
    for (let i = 0; i < len; i++) {
      const p = s1.data[i]?.period ?? s2.data[i]?.period ?? '';
      const a = s1.data[i]?.count ?? '';
      const b = s2.data[i]?.count ?? '';
      rows.push(`${p};${a};${b}`);
    }
    const blob = new Blob(['\ufeff' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `acessos-pje-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private formatLabel(period: string, g: Granularity): string {
    const d = new Date(period + 'T00:00:00');
    switch (g) {
      case 'day':
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      case 'week':
        return 'Sem ' + d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      case 'month':
        return d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      case 'year':
        return d.getFullYear().toString();
    }
  }
}
