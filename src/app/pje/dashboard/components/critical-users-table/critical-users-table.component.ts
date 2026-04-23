import { Component, computed, input, signal } from '@angular/core';
import {
  CONFORMIDADE_LABEL,
  LOCALIZACAO_LABEL,
  ORGAO_LABEL,
  PERFIL_LABEL,
  SISTEMA_LABEL,
  StatusConformidade,
  Usuario,
  VINCULO_LABEL,
} from '../../dashboard.model';

interface Row {
  user: Usuario;
  ultimoAcessoFmt: string;
  conformidadeBadges: { label: string; tone: string }[];
  vinculoTone: string;
}

@Component({
  selector: 'app-critical-users-table',
  standalone: true,
  templateUrl: './critical-users-table.component.html',
  styleUrl: './critical-users-table.component.scss',
})
export class CriticalUsersTableComponent {
  users = input.required<Usuario[]>();
  allowExpand = input<boolean>(false);
  modalType = input<string>('');

  readonly orgaoLabel = ORGAO_LABEL;
  readonly sistemaLabel = SISTEMA_LABEL;
  readonly vinculoLabel = VINCULO_LABEL;
  readonly perfilLabel = PERFIL_LABEL;
  readonly localizacaoLabel = LOCALIZACAO_LABEL;

  searchTerm = signal<string>('');
  
  showFilters = signal(false);
  filterOrgao = signal<string[]>([]);
  filterSistema = signal<string[]>([]);
  filterVinculo = signal<string[]>([]);
  filterSituacao = signal<string[]>([]);
  filterPerfil = signal<string[]>([]);
  filterSetor = signal<string[]>([]);

  toggleFilters(): void {
    this.showFilters.set(!this.showFilters());
  }

  toggleFilterSelection(group: 'orgao' | 'sistema' | 'vinculo' | 'situacao' | 'perfil' | 'setor', value: string): void {
    if (group === 'orgao') {
      this.filterOrgao.update(v => v.includes(value) ? v.filter(x => x !== value) : [...v, value]);
    } else if (group === 'sistema') {
      this.filterSistema.update(v => v.includes(value) ? v.filter(x => x !== value) : [...v, value]);
    } else if (group === 'vinculo') {
      this.filterVinculo.update(v => v.includes(value) ? v.filter(x => x !== value) : [...v, value]);
    } else if (group === 'situacao') {
      this.filterSituacao.update(v => v.includes(value) ? v.filter(x => x !== value) : [...v, value]);
    } else if (group === 'perfil') {
      this.filterPerfil.update(v => v.includes(value) ? v.filter(x => x !== value) : [...v, value]);
    } else if (group === 'setor') {
      this.filterSetor.update(v => v.includes(value) ? v.filter(x => x !== value) : [...v, value]);
    }
  }

  onSearch(event: Event): void {
    const el = event.target as HTMLInputElement;
    this.searchTerm.set(el.value);
  }

  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const orgao = this.filterOrgao();
    const sistema = this.filterSistema();
    const vinculo = this.filterVinculo();
    const situacao = this.filterSituacao();
    const perfil = this.filterPerfil();
    const setor = this.filterSetor();

    let list = this.users();

    if (orgao.length) list = list.filter(u => orgao.includes(u.orgao));
    if (sistema.length) list = list.filter(u => sistema.includes(u.sistema));
    if (vinculo.length) list = list.filter(u => vinculo.includes(u.vinculo));
    if (perfil.length) list = list.filter(u => perfil.includes(u.perfil));
    if (setor.length) list = list.filter(u => setor.includes(u.localizacao));
    
    if (this.modalType() !== 'semEmail' && this.modalType() !== 'perfil-invalido' && situacao.length) {
      // O usuário deve ter apenas situações que estejam selecionadas no filtro
      list = list.filter(u => u.conformidade.every(c => situacao.includes(c)));
    }
    
    if (term) {
      list = list.filter(u => 
        u.nome.toLowerCase().includes(term) ||
        u.matricula.includes(term) ||
        this.orgaoLabel[u.orgao].toLowerCase().includes(term) ||
        this.sistemaLabel[u.sistema].toLowerCase().includes(term) ||
        this.vinculoLabel[u.vinculo].toLowerCase().includes(term)
      );
    }

    return list;
  });

  rows = computed<Row[]>(() =>
    this.filteredUsers().map((u) => ({
      user: u,
      ultimoAcessoFmt: this.formatUltimoAcesso(u.ultimoAcesso),
      conformidadeBadges: u.conformidade
        .filter((c) => c !== 'OK')
        .map((c) => ({ label: CONFORMIDADE_LABEL[c], tone: this.conformidadeTone(c) })),
       vinculoTone:
        u.vinculo === 'ATIVO'
          ? 'ok'
          : u.vinculo === 'INATIVO'
            ? 'danger'
            : 'warning',
    })),
  );

  expandedRows = signal<Set<string>>(new Set());

  toggleExpand(id: string): void {
    const s = new Set(this.expandedRows());
    if (s.has(id)) s.delete(id);
    else s.add(id);
    this.expandedRows.set(s);
  }

  private formatUltimoAcesso(iso: string | null): string {
    if (!iso) return 'Nunca';
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('pt-BR');
  }

  private conformidadeTone(c: StatusConformidade): string {
    switch (c) {
      case 'ACESSO_INVALIDO':
      case 'EXPIRADO':
        return 'danger';
      case 'PROXIMO_EXPIRAR':
      case 'PERFIL_INVALIDO':
        return 'warning';
      case 'SEM_EMAIL_INSTITUCIONAL':
        return 'accent';
      default:
        return 'gray';
    }
  }
}
