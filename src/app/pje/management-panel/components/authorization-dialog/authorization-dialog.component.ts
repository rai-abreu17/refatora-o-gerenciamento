import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

import { PjeUserService, PjeAuthorization } from '../../../services/pje-user.service';

@Component({
  selector: 'app-authorization-dialog',
  standalone: true,
  imports: [MatDialogModule, MatCardModule, MatIconModule, MatChipsModule, MatProgressSpinnerModule, MatDividerModule],
  template: `
    <h2 mat-dialog-title>Autorizacoes — {{ data.userName }}</h2>
    <mat-dialog-content>
      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (authorizations().length === 0) {
        <p class="empty-msg">Nenhuma autorizacao encontrada.</p>
      } @else {
        @for (auth of authorizations(); track $index) {
          <mat-card appearance="outlined" class="auth-card">
            <mat-card-header>
              <mat-icon mat-card-avatar class="auth-icon">security</mat-icon>
              <mat-card-title>{{ auth.perfil }}</mat-card-title>
              <mat-card-subtitle>{{ auth.sistema }} — {{ auth.localizacaoFisica }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="auth-grid">
                <span class="label">E-mail</span>
                <span>{{ auth.email }}</span>
                <span class="label">Tipo Usu. Adj.</span>
                <span>{{ auth.origemAdjudicador }}</span>
                <span class="label">Modelo Loc.</span>
                <span>{{ auth.modeloLocalizacao }}</span>
                <span class="label">Periodo</span>
                <span>{{ auth.dataInicial }} a {{ auth.dataFinal }}</span>
                <span class="label">Renovavel</span>
                <span>
                  <mat-icon [class]="auth.perfilRenovavel ? 'icon-success' : 'icon-danger'">
                    {{ auth.perfilRenovavel ? 'check_circle' : 'cancel' }}
                  </mat-icon>
                </span>
                <span class="label">Valido</span>
                <span>
                  <mat-icon [class]="auth.perfilValido ? 'icon-success' : 'icon-danger'">
                    {{ auth.perfilValido ? 'check_circle' : 'cancel' }}
                  </mat-icon>
                </span>
                @if (auth.tipoRemocao) {
                  <span class="label">Remocao</span>
                  <span>{{ auth.tipoRemocao }} — {{ auth.dataRemocao }}</span>
                  <span class="label">Motivo</span>
                  <span>{{ auth.motivoRemocao || '-' }}</span>
                }
                <span class="label">Ultimo Acesso</span>
                <span>{{ auth.dataUltimoAcesso }}</span>
              </div>
            </mat-card-content>
          </mat-card>
        }
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Fechar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .loading-container { display: flex; justify-content: center; padding: 40px; }
    .empty-msg { text-align: center; color: var(--color-text-secondary); padding: 24px; }
    .auth-card { margin-bottom: 12px; }
    .auth-icon { color: var(--color-primary, #1B4F8A); background: none; }
    .auth-grid { display: grid; grid-template-columns: 120px 1fr; gap: 6px 12px; font-size: 0.875rem; padding-top: 8px; }
    .label { font-weight: 500; color: var(--color-text-secondary); }
    .icon-success { color: #2E7D32; font-size: 20px; }
    .icon-danger { color: #C62828; font-size: 20px; }
    mat-dialog-content { max-height: 70vh; }
  `]
})
export class AuthorizationDialogComponent implements OnInit {
  data = inject<{ userId: number; userName: string }>(MAT_DIALOG_DATA);
  private userService = inject(PjeUserService);

  loading = signal(true);
  authorizations = signal<PjeAuthorization[]>([]);

  ngOnInit(): void {
    this.userService.getAuthorizations(this.data.userId).subscribe(auths => {
      this.authorizations.set(auths);
      this.loading.set(false);
    });
  }
}
