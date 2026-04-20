import { Component, input, output, computed } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  DashboardFilters,
  Orgao,
  ORGAO_LABEL,
  Origem,
  ORIGEM_LABEL,
  Sistema,
  SISTEMA_LABEL,
} from '../../dashboard.model';

type FilterKind = 'orgao' | 'sistema' | 'origem';

@Component({
  selector: 'app-dashboard-filters',
  standalone: true,
  imports: [MatChipsModule, MatIconModule, MatButtonModule],
  templateUrl: './dashboard-filters.component.html',
  styleUrl: './dashboard-filters.component.scss',
})
export class DashboardFiltersComponent {
  filters = input.required<DashboardFilters>();
  filtersChange = output<DashboardFilters>();

  orgaos: Orgao[] = ['TRE-MA', 'TSE'];
  sistemas: Sistema[] = ['PJe1G', 'PJe2G'];
  origens: Origem[] = ['INTERNO', 'EXTERNO'];

  orgaoLabel = ORGAO_LABEL;
  sistemaLabel = SISTEMA_LABEL;
  origemLabel = ORIGEM_LABEL;

  hasActive = computed(() => {
    const f = this.filters();
    return f.orgaos.length + f.sistemas.length + f.origens.length > 0;
  });

  toggle(kind: FilterKind, value: string): void {
    const f = this.filters();
    const next: DashboardFilters = { ...f };
    const key = kind === 'orgao' ? 'orgaos' : kind === 'sistema' ? 'sistemas' : 'origens';
    const arr = [...(next[key] as string[])];
    const idx = arr.indexOf(value);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(value);
    (next[key] as string[]) = arr;
    this.filtersChange.emit(next);
  }

  isActive(kind: FilterKind, value: string): boolean {
    const f = this.filters();
    const key = kind === 'orgao' ? 'orgaos' : kind === 'sistema' ? 'sistemas' : 'origens';
    return (f[key] as string[]).includes(value);
  }

  clearAll(): void {
    this.filtersChange.emit({ ...this.filters(), orgaos: [], sistemas: [], origens: [] });
  }
}
