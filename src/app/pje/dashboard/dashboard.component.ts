import { Component, OnInit, inject, signal, computed } from '@angular/core';

import { DashboardService, DashboardSnapshot } from '../services/dashboard.service';
import { DashboardFilters, EMPTY_FILTERS, Granularity } from './dashboard.model';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { DashboardFiltersComponent } from './components/dashboard-filters/dashboard-filters.component';
import { KpiStatCardComponent } from './components/kpi-stat-card/kpi-stat-card.component';
import { TrendChartComponent } from './components/trend-chart/trend-chart.component';
import { LoginHeatmapComponent } from './components/login-heatmap/login-heatmap.component';
import { DistributionChartComponent } from './components/distribution-chart/distribution-chart.component';
import { LastAccessBucketsComponent } from './components/last-access-buckets/last-access-buckets.component';
import { CriticalUsersTableComponent } from './components/critical-users-table/critical-users-table.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DashboardFiltersComponent,
    KpiStatCardComponent,
    TrendChartComponent,
    LoginHeatmapComponent,
    DistributionChartComponent,
    LastAccessBucketsComponent,
    CriticalUsersTableComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly service = inject(DashboardService);

  filters = signal<DashboardFilters>({ ...EMPTY_FILTERS });
  snapshot = signal<DashboardSnapshot | null>(null);
  loading = signal(false);

  activeModal = signal<'acessos-criticos' | 'sem-email' | 'perfil-incorreto' | 'taxa-conformidade' | null>(null);

  modalData = computed(() => {
    const snap = this.snapshot();
    const modal = this.activeModal();
    if (!snap || !modal) return null;

    switch (modal) {
      case 'acessos-criticos': return { title: 'Acessos críticos', subtitle: 'Usuários com acesso inválido, expirado ou próximo de expirar', users: snap.kpiUsers.acessosCriticos };
      case 'sem-email': return { title: 'Sem e-mail institucional', subtitle: 'Usuários que não possuem um e-mail institucional registrado', users: snap.kpiUsers.semEmail };
      case 'perfil-incorreto': return { title: 'Perfil incorreto', subtitle: 'Usuários identificados com perfis incompatíveis', users: snap.kpiUsers.perfilIncorreto };
      case 'taxa-conformidade': return { title: 'Usuários regulares', subtitle: 'Usuários sem nenhuma pendência ou alerta de conformidade', users: snap.kpiUsers.conformes };
      default: return null;
    }
  });

  openModal(kpiId: string): void {
    if (kpiId !== 'total-usuarios') {
      this.activeModal.set(kpiId as any);
    }
  }

  closeModal(): void {
    this.activeModal.set(null);
  }

  ngOnInit(): void {
    this.load();
  }

  onFiltersChange(next: DashboardFilters): void {
    this.filters.set(next);
    this.load();
  }

  onGranularityChange(g: Granularity): void {
    this.filters.update((f) => ({ ...f, granularity: g }));
    this.load();
  }

  orgaoSistemaCategories(): string[] {
    return ['TRE-MA', 'TSE'];
  }

  orgaoSistemaSeries(snap: DashboardSnapshot) {
    const find = (orgao: string, sistema: string) =>
      snap.orgaoSistema.find((x) => x.orgao === orgao && x.sistema === sistema)?.count ?? 0;
    return [
      {
        label: 'PJe 1G',
        color: '#1B4F8A',
        data: [find('TRE-MA', 'PJe1G'), find('TSE', 'PJe1G')],
      },
      {
        label: 'PJe 2G',
        color: '#E8A000',
        data: [find('TRE-MA', 'PJe2G'), find('TSE', 'PJe2G')],
      },
    ];
  }

  private load(): void {
    this.loading.set(true);
    this.service.getSnapshot(this.filters()).subscribe((snap) => {
      this.snapshot.set(snap);
      this.loading.set(false);
    });
  }
}
