import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { LookupService } from '../../../../shared/services/lookup.service';
import { cpfValidatorFn } from '../../../../shared/validators/cpf.validator';

@Component({
  selector: 'app-member-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatDatepickerModule,
  ],
  template: `
    <h2 mat-dialog-title>Adicionar Membro</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-fields">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>CPF</mat-label>
          <input matInput formControlName="cpf" placeholder="000.000.000-00" maxlength="14"
            (input)="onCpfInput($event)">
          @if (form.controls['cpf'].hasError('required') && form.controls['cpf'].touched) {
            <mat-error>CPF e obrigatorio.</mat-error>
          } @else if (form.controls['cpf'].invalid && form.controls['cpf'].touched) {
            <mat-error>CPF invalido.</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nome</mat-label>
          <input matInput formControlName="nome" placeholder="Nome completo">
          @if (form.controls['nome'].hasError('required') && form.controls['nome'].touched) {
            <mat-error>Nome e obrigatorio.</mat-error>
          } @else if (form.controls['nome'].hasError('minlength') && form.controls['nome'].touched) {
            <mat-error>Minimo 3 caracteres.</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
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

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Data de Desligamento</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="dataDesligamento">
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancelar</button>
      <button mat-flat-button color="primary" (click)="onSubmit()">Adicionar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-fields { display: flex; flex-direction: column; gap: 4px; padding-top: 8px; min-width: 350px; }
    .full-width { width: 100%; }
    @media (max-width: 600px) { .form-fields { min-width: auto; } }
  `]
})
export class MemberFormDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<MemberFormDialogComponent>);
  private fb = inject(FormBuilder);
  private lookupService = inject(LookupService);

  form!: FormGroup;
  origens: string[] = [];

  ngOnInit(): void {
    this.origens = this.lookupService.getOrigens();
    this.form = this.fb.group({
      cpf: ['', [Validators.required, cpfValidatorFn()]],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      origem: ['', Validators.required],
      dataDesligamento: [''],
    });
  }

  onCpfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.substring(0, 11);
    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    input.value = value;
    this.form.get('cpf')?.setValue(value.replace(/\D/g, ''));
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
