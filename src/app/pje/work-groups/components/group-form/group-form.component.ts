import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { WorkGroup } from '../../../services/work-group.service';
import { LookupService } from '../../../../shared/services/lookup.service';

@Component({
  selector: 'app-group-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.group ? 'Editar Grupo' : 'Novo Grupo' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-fields">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nome</mat-label>
          <input matInput formControlName="nome" placeholder="Nome do grupo">
          @if (form.controls['nome'].hasError('required') && form.controls['nome'].touched) {
            <mat-error>Nome e obrigatorio.</mat-error>
          } @else if (form.controls['nome'].hasError('minlength') && form.controls['nome'].touched) {
            <mat-error>Minimo 3 caracteres.</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Origem</mat-label>
          <mat-select formControlName="origem">
            <mat-option value="">Selecione...</mat-option>
            @for (o of origens; track o) {
              <mat-option [value]="o">{{ o }}</mat-option>
            }
          </mat-select>
          @if (form.controls['origem'].hasError('required') && form.controls['origem'].touched) {
            <mat-error>Origem e obrigatoria.</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancelar</button>
      <button mat-flat-button color="primary" (click)="onSubmit()">
        {{ data.group ? 'Salvar Alteracoes' : 'Criar Grupo' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-fields { display: flex; flex-direction: column; gap: 4px; padding-top: 8px; min-width: 350px; }
    .full-width { width: 100%; }
    @media (max-width: 600px) { .form-fields { min-width: auto; } }
  `]
})
export class GroupFormDialogComponent implements OnInit {
  data = inject<{ group: WorkGroup | null }>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<GroupFormDialogComponent>);
  private fb = inject(FormBuilder);
  private lookupService = inject(LookupService);

  form!: FormGroup;
  origens: string[] = [];

  ngOnInit(): void {
    this.origens = this.lookupService.getOrigens();
    const g = this.data.group;
    this.form = this.fb.group({
      nome: [g?.nome || '', [Validators.required, Validators.minLength(3)]],
      origem: [g?.origem || '', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
