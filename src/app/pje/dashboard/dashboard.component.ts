import { Component, OnInit, signal, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import {
  Chart,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartConfiguration,
} from 'chart.js';

import { DashboardService, AccessCountResponse } from '../services/dashboard.service';
import { KpiCardComponent } from './components/kpi-card/kpi-card.component';
import { PeriodFilterComponent, Granularity } from './components/period-filter/period-filter.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    BaseChartDirective,
    KpiCardComponent,
    PeriodFilterComponent,
    PageHeaderComponent,
    MatCardModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  loading = signal(false);
  granularity = signal<Granularity>('day');
  startDate = signal<Date | null>(null);
  endDate = signal<Date | null>(null);

  data1G = signal<AccessCountResponse | null>(null);
  data2G = signal<AccessCountResponse | null>(null);

  chartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'PJe 1G',
        data: [],
        borderColor: '#1B4F8A',
        backgroundColor: 'rgba(27, 79, 138, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 2,
        pointHoverRadius: 5,
      },
      {
        label: 'PJe 2G',
        data: [],
        borderColor: '#E8A000',
        backgroundColor: 'rgba(232, 160, 0, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 2,
        pointHoverRadius: 5,
      },
    ],
  };

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${(ctx.parsed.y ?? 0).toLocaleString('pt-BR')} acessos`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => Number(value).toLocaleString('pt-BR'),
        },
      },
    },
  };

  get totalAcessos(): string {
    const t1 = this.data1G()?.total ?? 0;
    const t2 = this.data2G()?.total ?? 0;
    return (t1 + t2).toLocaleString('pt-BR');
  }

  get picoAcessos(): string {
    const p1 = this.data1G()?.peak?.count ?? 0;
    const p2 = this.data2G()?.peak?.count ?? 0;
    return Math.max(p1, p2).toLocaleString('pt-BR');
  }

  get picoSubtitle(): string {
    const d1 = this.data1G();
    const d2 = this.data2G();
    if (!d1?.peak && !d2?.peak) return '';
    const peak1 = d1?.peak?.count ?? 0;
    const peak2 = d2?.peak?.count ?? 0;
    const peak = peak1 >= peak2 ? d1?.peak : d2?.peak;
    return peak?.period ?? '';
  }

  get menorAcesso(): string {
    const l1 = this.data1G()?.lowest?.count ?? Infinity;
    const l2 = this.data2G()?.lowest?.count ?? Infinity;
    const min = Math.min(l1, l2);
    return min === Infinity ? '0' : min.toLocaleString('pt-BR');
  }

  get menorSubtitle(): string {
    const d1 = this.data1G();
    const d2 = this.data2G();
    if (!d1?.lowest && !d2?.lowest) return '';
    const low1 = d1?.lowest?.count ?? Infinity;
    const low2 = d2?.lowest?.count ?? Infinity;
    const lowest = low1 <= low2 ? d1?.lowest : d2?.lowest;
    return lowest?.period ?? '';
  }

  ngOnInit(): void {
    this.applyDefaultDateRange('day');
    this.loadData();
  }

  onGranularityChange(g: Granularity): void {
    this.granularity.set(g);
    this.applyDefaultDateRange(g);
    this.loadData();
  }

  onStartDateChange(date: Date | null): void {
    this.startDate.set(date);
    if (date && this.endDate()) this.loadData();
  }

  onEndDateChange(date: Date | null): void {
    this.endDate.set(date);
    if (date && this.startDate()) this.loadData();
  }

  private applyDefaultDateRange(g: Granularity): void {
    const today = new Date();
    const start = new Date(today);

    switch (g) {
      case 'day': start.setDate(today.getDate() - 30); break;
      case 'week': start.setDate(today.getDate() - 84); break;
      case 'month': start.setMonth(today.getMonth() - 12); break;
      case 'year': start.setFullYear(today.getFullYear() - 5); break;
    }

    this.startDate.set(start);
    this.endDate.set(today);
  }

  private formatDate(d: Date | null): string {
    if (!d) return '';
    return d.toISOString().split('T')[0];
  }

  loadData(): void {
    this.loading.set(true);
    let completed = 0;

    const onComplete = () => {
      completed++;
      if (completed === 2) {
        this.updateChart();
        this.loading.set(false);
      }
    };

    const start = this.formatDate(this.startDate());
    const end = this.formatDate(this.endDate());

    this.dashboardService
      .getAccessCount('PJe 1G', this.granularity(), start, end)
      .subscribe((res) => { this.data1G.set(res); onComplete(); });

    this.dashboardService
      .getAccessCount('PJe 2G', this.granularity(), start, end)
      .subscribe((res) => { this.data2G.set(res); onComplete(); });
  }

  private updateChart(): void {
    const d1 = this.data1G();
    const d2 = this.data2G();
    if (!d1 || !d2) return;

    const g = this.granularity();
    this.chartData.labels = d1.data.map((d) => {
      const date = new Date(d.period + 'T00:00:00');
      switch (g) {
        case 'day': return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        case 'week': return 'Sem ' + date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        case 'month': return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
        case 'year': return date.getFullYear().toString();
        default: return d.period;
      }
    });
    this.chartData.datasets[0].data = d1.data.map((d) => d.count);
    this.chartData.datasets[1].data = d2.data.map((d) => d.count);
    this.chart?.update();
  }
}
