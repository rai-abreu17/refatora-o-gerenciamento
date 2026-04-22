import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly service = inject(DashboardService);

  filters = signal<DashboardFilters>({ ...EMPTY_FILTERS });
  snapshot = signal<DashboardSnapshot | null>(null);
  loading = signal(false);

  heatmapSelection = signal<{dia: number, hora: number, count: number} | null>(null);
  vinculoSelection = signal<any>(null);
  bucketSelection = signal<any>(null);
  perfilSelection = signal<any>(null);
  origemSelection = signal<any>(null);
  activeModal = signal<'acessos-criticos' | 'sem-email' | 'perfil-incorreto' | 'taxa-conformidade' | 'heatmap-users' | 'vinculo-users' | 'bucket-users' | 'perfil-users' | 'origem-users' | null>(null);

  onHeatmapCellClick(data: {dia: number, hora: number, count: number}): void {
    this.heatmapSelection.set(data);
    this.activeModal.set('heatmap-users');
  }

  onVinculoSliceClick(slice: any): void {
    this.vinculoSelection.set(slice);
    this.activeModal.set('vinculo-users');
  }

  onBucketClick(bucket: any): void {
    this.bucketSelection.set(bucket);
    this.activeModal.set('bucket-users');
  }

  onPerfilSliceClick(slice: any): void {
    this.perfilSelection.set(slice);
    this.activeModal.set('perfil-users');
  }

  onOrigemSliceClick(slice: any): void {
    this.origemSelection.set(slice);
    this.activeModal.set('origem-users');
  }

  modalData = computed(() => {
    const snap = this.snapshot();
    const modal = this.activeModal();
    if (!snap || !modal) return null;

    switch (modal) {
      case 'acessos-criticos': return { title: 'Acessos críticos', subtitle: 'Usuários com acesso inválido, expirado ou próximo de expirar', users: snap.kpiUsers.acessosCriticos, type: 'acessos-criticos' };
      case 'sem-email': return { title: 'Sem e-mail institucional', subtitle: 'Usuários que não possuem um e-mail institucional registrado', users: snap.kpiUsers.semEmail, type: 'semEmail' };
      case 'perfil-incorreto': return { title: 'Perfil incorreto', subtitle: 'Usuários identificados com perfis incompatíveis', users: snap.kpiUsers.perfilIncorreto, type: 'perfil-incorreto' };
      case 'taxa-conformidade': return { title: 'Usuários regulares', subtitle: 'Usuários sem nenhuma pendência ou alerta de conformidade', users: snap.kpiUsers.conformes, type: 'taxa-conformidade' };
      case 'heatmap-users': {
        const sel = this.heatmapSelection();
        if (!sel) return null;
        
        // Simulação de usuários: junta todos os usuários conhecidos e pega uma fatia proporcional ao horário clicado
        const allUsers = [
          ...snap.kpiUsers.acessosCriticos, 
          ...snap.kpiUsers.semEmail, 
          ...snap.kpiUsers.perfilIncorreto, 
          ...snap.kpiUsers.conformes
        ];
        
        const DIA_LABEL = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        const seed = sel.dia * 24 + sel.hora; // Pseudo-random seed baseada no dia/hora
        
        // Pega uma amostra de usuários para simular a lista que acessou no horário
        // Removemos duplicatas (mesmo ID) que possam ter vindo do join das listas
        const uniqueUsers = Array.from(new Map(allUsers.map(u => [u.id, u])).values());
        const start = seed % (uniqueUsers.length > 50 ? uniqueUsers.length - 50 : 0);
        const usersForPeriod = uniqueUsers.slice(start, start + Math.min(sel.count, 200));

        return { 
          title: `Logins em ${DIA_LABEL[sel.dia]} às ${sel.hora.toString().padStart(2, '0')}h`, 
          subtitle: `${sel.count.toLocaleString('pt-BR')} acessos registrados no sistema durante este período.`, 
          users: usersForPeriod, 
          type: 'heatmap-users' 
        };
      }
      case 'vinculo-users': {
        const sel = this.vinculoSelection();
        if (!sel) return null;
        
        const allUsers = [
          ...snap.kpiUsers.acessosCriticos, 
          ...snap.kpiUsers.semEmail, 
          ...snap.kpiUsers.perfilIncorreto, 
          ...snap.kpiUsers.conformes
        ];
        const uniqueUsers = Array.from(new Map(allUsers.map(u => [u.id, u])).values());
        
        let vinculoType = 'ATIVO';
        if (sel.label.toLowerCase() === 'inativo') vinculoType = 'INATIVO';
        if (sel.label.toLowerCase() === 'sem vínculo') vinculoType = 'SEM_VINCULO';

        const filtered = uniqueUsers.filter(u => u.vinculo === vinculoType);
        
        return { 
          title: `Usuários com Vínculo: ${sel.label}`, 
          subtitle: `${filtered.length.toLocaleString('pt-BR')} usuários encontrados com este status cadastral.`, 
          users: filtered, 
          type: 'vinculo-users' 
        };
      }
      case 'bucket-users': {
        const sel = this.bucketSelection();
        if (!sel) return null;
        
        const allUsers = [
          ...snap.kpiUsers.acessosCriticos, 
          ...snap.kpiUsers.semEmail, 
          ...snap.kpiUsers.perfilIncorreto, 
          ...snap.kpiUsers.conformes
        ];
        const uniqueUsers = Array.from(new Map(allUsers.map(u => [u.id, u])).values());
        
        const diffDays = (dateStr: string | null) => {
          if (!dateStr) return -1;
          const d = new Date(dateStr);
          const now = new Date(); // Usando hoje como referência para o mock
          const diffTime = Math.abs(now.getTime() - d.getTime());
          return Math.floor(diffTime / (1000 * 60 * 60 * 24));
        };

        const filtered = uniqueUsers.filter(u => {
           const days = diffDays(u.ultimoAcesso);
           switch(sel.key) {
             case 'never': return days === -1;
             case '0-7': return days >= 0 && days <= 7;
             case '7-30': return days > 7 && days <= 30;
             case '30-90': return days > 30 && days <= 90;
             case '90+': return days > 90;
             default: return false;
           }
        });
        
        return { 
          title: `Inatividade: ${sel.label}`, 
          subtitle: `${filtered.length.toLocaleString('pt-BR')} usuários encontrados nesta faixa de tempo.`, 
          users: filtered, 
          type: 'bucket-users' 
        };
      }
      case 'perfil-users': {
        const sel = this.perfilSelection();
        if (!sel) return null;
        
        const allUsers = [
          ...snap.kpiUsers.acessosCriticos, 
          ...snap.kpiUsers.semEmail, 
          ...snap.kpiUsers.perfilIncorreto, 
          ...snap.kpiUsers.conformes
        ];
        const uniqueUsers = Array.from(new Map(allUsers.map(u => [u.id, u])).values());
        
        // Remove acentos e converte para minúsculo para comparar (ex: "Estagiário" -> "estagiario" == "ESTAGIARIO")
        const normalizedLabel = sel.label.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const filtered = uniqueUsers.filter(u => u.perfil.toLowerCase() === normalizedLabel);
        
        return { 
          title: `Usuários - Perfil: ${sel.label}`, 
          subtitle: `${filtered.length.toLocaleString('pt-BR')} usuários possuem este papel cadastrado no PJe.`, 
          users: filtered, 
          type: 'perfil-users' 
        };
      }
      case 'origem-users': {
        const sel = this.origemSelection();
        if (!sel) return null;
        
        const allUsers = [
          ...snap.kpiUsers.acessosCriticos, 
          ...snap.kpiUsers.semEmail, 
          ...snap.kpiUsers.perfilIncorreto, 
          ...snap.kpiUsers.conformes
        ];
        const uniqueUsers = Array.from(new Map(allUsers.map(u => [u.id, u])).values());
        
        // Comparação de origem: INTERNO vs EXTERNO
        const normalizedLabel = sel.label.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
        const filtered = uniqueUsers.filter(u => u.origem.toUpperCase() === normalizedLabel);
        
        return { 
          title: `Origem do Usuário: ${sel.label}`, 
          subtitle: `${filtered.length.toLocaleString('pt-BR')} usuários são classificados como público ${sel.label.toLowerCase()}.`, 
          users: filtered, 
          type: 'origem-users' 
        };
      }
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

  exportToCsv(): void {
    const data = this.modalData();
    if (!data || !data.users.length) return;

    const headers = ['Nome', 'Matrícula', 'Órgão', 'Sistema', 'Origem', 'Situação', 'Último Acesso', 'Perfil', 'Setor/Lotação'];
    const rows = data.users.map(u => [
      `"${u.nome}"`,
      `"${u.matricula}"`,
      `"${u.orgao}"`,
      `"${u.sistema}"`,
      `"${u.origem}"`,
      `"${u.vinculo}"`,
      `"${u.ultimoAcesso || 'Nunca acessou'}"`,
      `"${u.perfil}"`,
      `"${u.localizacao}"`
    ].join(';')); 

    const csvContent = [headers.join(';'), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }); 
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${data.type}-${new Date().getTime()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
