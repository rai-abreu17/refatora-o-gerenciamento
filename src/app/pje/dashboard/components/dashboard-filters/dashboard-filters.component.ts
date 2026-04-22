import { Component, input, output, computed, signal } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import {
  DashboardFilters,
  Localizacao,
  LOCALIZACAO_LABEL,
  Orgao,
  ORGAO_LABEL,
  Origem,
  ORIGEM_LABEL,
  PerfilPJe,
  PERFIL_LABEL,
  Sistema,
  SISTEMA_LABEL,
} from '../../dashboard.model';

type FilterKind = 'orgao' | 'sistema' | 'origem' | 'perfil' | 'localizacao';

@Component({
  selector: 'app-dashboard-filters',
  standalone: true,
  imports: [
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
  ],
  templateUrl: './dashboard-filters.component.html',
  styleUrl: './dashboard-filters.component.scss',
})
export class DashboardFiltersComponent {
  filters = input.required<DashboardFilters>();
  filtersChange = output<DashboardFilters>();

  orgaos: Orgao[] = ['TRE-MA', 'TSE'];
  sistemas: Sistema[] = ['PJe1G', 'PJe2G'];
  origens: Origem[] = ['INTERNO', 'EXTERNO'];
  perfis: PerfilPJe[] = ['MAGISTRADO', 'SERVIDOR', 'ADVOGADO', 'PROCURADOR', 'ESTAGIARIO', 'PERITO'];
  localizacoes: Localizacao[] = [
    'SECRETARIA_JUDICIARIA',
    'SECRETARIA_ADMINISTRACAO',
    'SECRETARIA_TI',
    'SECRETARIA_GESTAO_PESSOAS',
    'CORREGEDORIA',
    'PRESIDENCIA',
    'ESCOLA_JUDICIARIA',
    'OUVIDORIA',
    'CARTORIO_ELEITORAL',
    'PROCURADORIA_REGIONAL',
    'PROCURADORIA_GERAL',
  ];

  orgaoLabel = ORGAO_LABEL;
  sistemaLabel = SISTEMA_LABEL;
  origemLabel = ORIGEM_LABEL;
  perfilLabel = PERFIL_LABEL;
  localizacaoLabel = LOCALIZACAO_LABEL;

  searchPerfil = signal<string>('');
  searchLocalizacao = signal<string>('');

  filteredPerfis = computed(() => {
    const term = this.searchPerfil().toLowerCase();
    if (!term) return this.perfis;
    return this.perfis.filter(p => this.perfilLabel[p].toLowerCase().includes(term));
  });

  filteredLocalizacoes = computed(() => {
    const term = this.searchLocalizacao().toLowerCase();
    if (!term) return this.localizacoes;
    return this.localizacoes.filter(l => this.localizacaoLabel[l].toLowerCase().includes(term));
  });

  onSearchPerfil(event: Event): void {
    const el = event.target as HTMLInputElement;
    this.searchPerfil.set(el.value);
  }

  onSearchLocalizacao(event: Event): void {
    const el = event.target as HTMLInputElement;
    this.searchLocalizacao.set(el.value);
  }

  hasActive = computed(() => {
    const f = this.filters();
    return (
      f.orgaos.length +
        f.sistemas.length +
        f.origens.length +
        f.perfis.length +
        f.localizacoes.length >
        0 ||
      f.startDate !== null ||
      f.endDate !== null
    );
  });

  private keyOf(kind: FilterKind): keyof Pick<
    DashboardFilters,
    'orgaos' | 'sistemas' | 'origens' | 'perfis' | 'localizacoes'
  > {
    switch (kind) {
      case 'orgao': return 'orgaos';
      case 'sistema': return 'sistemas';
      case 'origem': return 'origens';
      case 'perfil': return 'perfis';
      case 'localizacao': return 'localizacoes';
    }
  }

  toggle(kind: FilterKind, value: string): void {
    const f = this.filters();
    const key = this.keyOf(kind);
    const arr = [...(f[key] as string[])];
    const idx = arr.indexOf(value);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(value);
    this.filtersChange.emit({ ...f, [key]: arr } as DashboardFilters);
  }

  isActive(kind: FilterKind, value: string): boolean {
    const f = this.filters();
    return (f[this.keyOf(kind)] as string[]).includes(value);
  }

  onMultiSelectChange(kind: FilterKind, values: string[]): void {
    const key = this.keyOf(kind);
    
    // Se o usuário clicou na opção especial "ALL", limpamos a seleção (o que equivale a "Todos")
    if (values.includes('ALL')) {
      values = [];
    }
    
    this.filtersChange.emit({ ...this.filters(), [key]: values } as DashboardFilters);
  }

  onStartDateChange(date: Date | null): void {
    this.filtersChange.emit({ ...this.filters(), startDate: date });
  }

  onEndDateChange(date: Date | null): void {
    this.filtersChange.emit({ ...this.filters(), endDate: date });
  }

  clearAll(): void {
    this.filtersChange.emit({
      ...this.filters(),
      orgaos: [],
      sistemas: [],
      origens: [],
      perfis: [],
      localizacoes: [],
      startDate: null,
      endDate: null,
    });
  }
}
