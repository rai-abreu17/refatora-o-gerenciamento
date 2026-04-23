import { Component, output, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { LookupService } from '../../../../shared/services/lookup.service';

@Component({
  selector: 'app-advanced-filters',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule, MatDividerModule,
  ],
  template: `
    <div class="filter-panel">
      <div class="filter-panel__header">
        <h3>Filtros Avancados</h3>
        <button mat-icon-button (click)="close.emit()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <mat-divider></mat-divider>

      <div class="filter-panel__body">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>E-mail</mat-label>
          <input matInput [formControl]="form.controls.email" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Lotacao</mat-label>
          <mat-select [formControl]="form.controls.lotacao">
            <mat-option value="">Todas</mat-option>
            @for (l of lotacoes; track l) {
              <mat-option [value]="l">{{ l }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Categoria Funcional</mat-label>
          <mat-select [formControl]="form.controls.categoriaFuncional">
            <mat-option value="">Todas</mat-option>
            @for (c of categorias; track c) {
              <mat-option [value]="c">{{ c }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tipo de Usuário</mat-label>
          <mat-select [formControl]="form.controls.origem">
            <mat-option value="">Todas</mat-option>
            <mat-option value="TRE-MA">TRE-MA</mat-option>
            <mat-option value="TSE">TSE</mat-option>
            <mat-option value="CNJ">CNJ</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tipo Usuario</mat-label>
          <mat-select [formControl]="form.controls.tipoUsuario">
            <mat-option value="">Todos</mat-option>
            <mat-option value="Interno">Interno</mat-option>
            <mat-option value="Externo">Externo</mat-option>
            <mat-option value="Magistrado">Magistrado</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Perfis Validados</mat-label>
          <mat-select [formControl]="form.controls.todosPerfisValidados">
            <mat-option value="">Todos</mat-option>
            <mat-option value="true">Sim</mat-option>
            <mat-option value="false">Nao</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>E-mail TRE-MA</mat-label>
          <input matInput [formControl]="form.controls.emailTrema" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nome TRE-MA</mat-label>
          <input matInput [formControl]="form.controls.nomeTrema" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tempo Inatividade (dias)</mat-label>
          <input matInput type="number" [formControl]="form.controls.tempoInatividade" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Busca Geral</mat-label>
          <input matInput [formControl]="form.controls.search" placeholder="Buscar em todos os campos..." />
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>

      <mat-divider></mat-divider>
      <div class="filter-panel__actions">
        <button mat-button (click)="onClear()">Limpar</button>
        <button mat-flat-button color="primary" (click)="onApply()">Aplicar Filtros</button>
      </div>
    </div>
  `,
  styles: [`
    .filter-panel { display: flex; flex-direction: column; height: 100%; width: 340px; }
    .filter-panel__header { display: flex; justify-content: space-between; align-items: center; padding: 16px; }
    .filter-panel__header h3 { margin: 0; font-size: 1.1rem; }
    .filter-panel__body { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 4px; }
    .filter-panel__actions { display: flex; justify-content: flex-end; gap: 8px; padding: 16px; }
    .full-width { width: 100%; }
  `]
})
export class AdvancedFiltersComponent implements OnInit {
  apply = output<Record<string, string>>();
  close = output<void>();

  private fb = inject(FormBuilder);
  private lookupService = inject(LookupService);

  lotacoes: string[] = [];
  categorias: string[] = [];

  form = this.fb.group({
    email: new FormControl(''),
    lotacao: new FormControl(''),
    categoriaFuncional: new FormControl(''),
    origem: new FormControl(''),
    tipoUsuario: new FormControl(''),
    todosPerfisValidados: new FormControl(''),
    emailTrema: new FormControl(''),
    nomeTrema: new FormControl(''),
    tempoInatividade: new FormControl(''),
    search: new FormControl(''),
  });

  ngOnInit(): void {
    this.lotacoes = this.lookupService.getLotacoes();
    this.categorias = this.lookupService.getCategoriasFuncionais();
  }

  onApply(): void {
    const raw = this.form.getRawValue();
    const filters: Record<string, string> = {};
    for (const [k, v] of Object.entries(raw)) {
      if (v) filters[k] = v as string;
    }
    this.apply.emit(filters);
  }

  onClear(): void {
    this.form.reset();
  }
}
