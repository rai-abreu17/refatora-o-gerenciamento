import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PjeRule } from '../../../services/pje-rule.service';
import { LookupService } from '../../../../shared/services/lookup.service';

@Component({
  selector: 'app-rule-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.rule ? 'Editar Regra' : 'Nova Regra' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Sistema</mat-label>
          <mat-select formControlName="sistema">
            <mat-option value="">Selecione...</mat-option>
            @for (s of sistemas; track s) {
              <mat-option [value]="s">{{ s }}</mat-option>
            }
          </mat-select>
          @if (form.controls['sistema'].hasError('required') && form.controls['sistema'].touched) {
            <mat-error>Sistema e obrigatorio.</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Tipo de Usuário</mat-label>
          <mat-select formControlName="origem">
            <mat-option value="">Selecione...</mat-option>
            @for (o of origens; track o) {
              <mat-option [value]="o">{{ o }}</mat-option>
            }
          </mat-select>
          @if (form.controls['origem'].hasError('required') && form.controls['origem'].touched) {
            <mat-error>Tipo de usuário é obrigatório.</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Lotacao</mat-label>
          <mat-select formControlName="lotacao">
            <mat-option value="">Selecione...</mat-option>
            @for (l of lotacoes; track l) {
              <mat-option [value]="l">{{ l }}</mat-option>
            }
          </mat-select>
          @if (form.controls['lotacao'].hasError('required') && form.controls['lotacao'].touched) {
            <mat-error>Lotacao e obrigatoria.</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Lotacao Filha</mat-label>
          <mat-select formControlName="lotacaoFilha">
            <mat-option value="Sim">Sim</mat-option>
            <mat-option value="Nao">Nao</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Funcao</mat-label>
          <mat-select formControlName="funcao">
            <mat-option value="">Selecione...</mat-option>
            @for (f of funcoes; track f) {
              <mat-option [value]="f">{{ f }}</mat-option>
            }
          </mat-select>
          @if (form.controls['funcao'].hasError('required') && form.controls['funcao'].touched) {
            <mat-error>Funcao e obrigatoria.</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Perfil</mat-label>
          <input matInput formControlName="perfil" placeholder="Ex: Servidor;Diretor de Secretaria">
          <mat-hint>Separe multiplos perfis com ponto e virgula (;)</mat-hint>
          @if (form.controls['perfil'].hasError('required') && form.controls['perfil'].touched) {
            <mat-error>Perfil e obrigatorio.</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Localizacao</mat-label>
          <mat-select formControlName="localizacao">
            <mat-option value="">Selecione...</mat-option>
            @for (l of localizacoes; track l) {
              <mat-option [value]="l">{{ l }}</mat-option>
            }
          </mat-select>
          @if (form.controls['localizacao'].hasError('required') && form.controls['localizacao'].touched) {
            <mat-error>Localizacao e obrigatoria.</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Grupo de Trabalho</mat-label>
          <mat-select formControlName="grupoTrabalho">
            <mat-option value="">Nenhum</mat-option>
            @for (g of gruposTrabalho; track g) {
              <mat-option [value]="g">{{ g }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-span">
          <mat-label>Situacao Funcional</mat-label>
          <mat-select formControlName="situacaoFuncional">
            <mat-option value="">Selecione...</mat-option>
            @for (s of situacoesFuncionais; track s) {
              <mat-option [value]="s">{{ s }}</mat-option>
            }
          </mat-select>
          @if (form.controls['situacaoFuncional'].hasError('required') && form.controls['situacaoFuncional'].touched) {
            <mat-error>Situacao funcional e obrigatoria.</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancelar</button>
      <button mat-flat-button color="primary" (click)="onSubmit()">
        {{ data.rule ? 'Salvar Alteracoes' : 'Criar Regra' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px 16px;
      padding-top: 8px;
    }
    .full-span { grid-column: 1 / -1; }
    mat-dialog-content { min-width: 500px; max-width: 100%; }
    @media (max-width: 600px) {
      .form-grid { grid-template-columns: 1fr; }
      mat-dialog-content { min-width: auto; }
    }
  `]
})
export class RuleFormDialogComponent implements OnInit {
  data = inject<{ rule: PjeRule | null }>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<RuleFormDialogComponent>);
  private fb = inject(FormBuilder);
  private lookupService = inject(LookupService);

  form!: FormGroup;
  sistemas: string[] = [];
  origens: string[] = [];
  lotacoes: string[] = [];
  funcoes: string[] = [];
  perfis: string[] = [];
  localizacoes: string[] = [];
  gruposTrabalho: string[] = [];
  situacoesFuncionais: string[] = [];

  ngOnInit(): void {
    this.sistemas = this.lookupService.getSistemas();
    this.origens = this.lookupService.getOrigens();
    this.lotacoes = this.lookupService.getLotacoes();
    this.funcoes = this.lookupService.getFuncoes();
    this.gruposTrabalho = this.lookupService.getGruposTrabalho();
    this.situacoesFuncionais = this.lookupService.getSituacoesFuncionais();

    const r = this.data.rule;
    this.form = this.fb.group({
      sistema: [r?.sistema || '', Validators.required],
      origem: [r?.origem || '', Validators.required],
      lotacao: [r?.lotacao || '', Validators.required],
      lotacaoFilha: [r?.lotacaoFilha || 'Nao', Validators.required],
      funcao: [r?.funcao || '', Validators.required],
      perfil: [r?.perfil || '', Validators.required],
      localizacao: [r?.localizacao || '', Validators.required],
      grupoTrabalho: [r?.grupoTrabalho || ''],
      situacaoFuncional: [r?.situacaoFuncional || '', Validators.required],
    });

    this.onSistemaChange(r?.sistema || '');
    this.form.get('sistema')?.valueChanges.subscribe((val: string) => {
      this.onSistemaChange(val);
    });
  }

  onSistemaChange(sistema: string): void {
    this.perfis = this.lookupService.getPerfis(sistema);
    this.localizacoes = this.lookupService.getLocalizacoes(sistema);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
