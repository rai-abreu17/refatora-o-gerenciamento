import { Component, computed, input } from '@angular/core';
import {
  CONFORMIDADE_LABEL,
  ORGAO_LABEL,
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

  readonly orgaoLabel = ORGAO_LABEL;
  readonly sistemaLabel = SISTEMA_LABEL;
  readonly vinculoLabel = VINCULO_LABEL;

  rows = computed<Row[]>(() =>
    this.users().map((u) => ({
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
            : 'gray',
    })),
  );

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
      case 'PERFIL_INCORRETO':
        return 'warning';
      case 'SEM_EMAIL_INSTITUCIONAL':
        return 'accent';
      default:
        return 'gray';
    }
  }
}
