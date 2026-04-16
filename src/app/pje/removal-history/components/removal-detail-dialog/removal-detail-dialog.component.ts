import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

import { RemovalRecord } from '../../../services/removal-history.service';

@Component({
  selector: 'app-removal-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, MatListModule, MatIconModule, MatButtonModule, MatChipsModule, MatDividerModule],
  template: `
    <h2 mat-dialog-title>Detalhes da Remocao</h2>
    <mat-dialog-content>
      <mat-list>
        <mat-list-item>
          <mat-icon matListItemIcon>person</mat-icon>
          <span matListItemTitle>Nome</span>
          <span matListItemLine>{{ data.nome }}</span>
        </mat-list-item>
        <mat-divider></mat-divider>

        <mat-list-item>
          <mat-icon matListItemIcon>category</mat-icon>
          <span matListItemTitle>Categoria</span>
          <span matListItemLine>{{ data.categoria }}</span>
        </mat-list-item>
        <mat-divider></mat-divider>

        <mat-list-item>
          <mat-icon matListItemIcon>business</mat-icon>
          <span matListItemTitle>Lotacao</span>
          <span matListItemLine>{{ data.lotacao }}</span>
        </mat-list-item>
        <mat-divider></mat-divider>

        <mat-list-item>
          <mat-icon matListItemIcon>computer</mat-icon>
          <span matListItemTitle>Sistema</span>
          <span matListItemLine>{{ data.sistema }}</span>
        </mat-list-item>
        <mat-divider></mat-divider>

        <mat-list-item>
          <mat-icon matListItemIcon>location_on</mat-icon>
          <span matListItemTitle>Localizacao Fisica</span>
          <span matListItemLine>{{ data.localizacaoFisica }}</span>
        </mat-list-item>
        <mat-divider></mat-divider>

        <mat-list-item>
          <mat-icon matListItemIcon>security</mat-icon>
          <span matListItemTitle>Perfil</span>
          <span matListItemLine>{{ data.perfil }}</span>
        </mat-list-item>
        <mat-divider></mat-divider>

        <mat-list-item>
          <mat-icon matListItemIcon>date_range</mat-icon>
          <span matListItemTitle>Periodo</span>
          <span matListItemLine>{{ data.dataInicial }} a {{ data.dataFinal }}</span>
        </mat-list-item>
        <mat-divider></mat-divider>

        <mat-list-item>
          <mat-icon matListItemIcon>{{ data.tipoRemocao === 'Automatico' ? 'smart_toy' : 'person' }}</mat-icon>
          <span matListItemTitle>Tipo de Remocao</span>
          <span matListItemLine>{{ data.tipoRemocao }}</span>
        </mat-list-item>
        <mat-divider></mat-divider>

        <mat-list-item>
          <mat-icon matListItemIcon>event</mat-icon>
          <span matListItemTitle>Data da Remocao</span>
          <span matListItemLine>{{ data.dataRemocao }}</span>
        </mat-list-item>
        <mat-divider></mat-divider>

        <mat-list-item>
          <mat-icon matListItemIcon>account_circle</mat-icon>
          <span matListItemTitle>Responsavel</span>
          <span matListItemLine>{{ data.usuarioRemocao }}</span>
        </mat-list-item>
        <mat-divider></mat-divider>

        <mat-list-item>
          <mat-icon matListItemIcon>{{ data.perfilValido ? 'check_circle' : 'cancel' }}</mat-icon>
          <span matListItemTitle>Perfil Valido</span>
          <span matListItemLine>{{ data.perfilValido ? 'Sim' : 'Nao' }}</span>
        </mat-list-item>
        <mat-divider></mat-divider>

        <mat-list-item>
          <mat-icon matListItemIcon>info</mat-icon>
          <span matListItemTitle>Situacao</span>
          <span matListItemLine>{{ data.situacao }}</span>
        </mat-list-item>
        <mat-divider></mat-divider>

        <mat-list-item>
          <mat-icon matListItemIcon>notifications</mat-icon>
          <span matListItemTitle>Notificado</span>
          <span matListItemLine>{{ data.notificado ? 'Sim (' + data.dataNotificacao + ')' : 'Nao' }}</span>
        </mat-list-item>
      </mat-list>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Fechar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content { max-height: 70vh; }
  `]
})
export class RemovalDetailDialogComponent {
  data = inject<RemovalRecord>(MAT_DIALOG_DATA);
}
