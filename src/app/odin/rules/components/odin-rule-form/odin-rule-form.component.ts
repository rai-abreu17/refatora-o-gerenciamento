import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OdinRule } from '../../../services/odin-rule.service';

@Component({
  selector: 'app-odin-rule-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './odin-rule-form.component.html',
  styleUrl: './odin-rule-form.component.scss'
})
export class OdinRuleFormComponent implements OnInit {
  @Input() rule: OdinRule | null = null;
  @Output() save = new EventEmitter<Partial<OdinRule>>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  isEdit = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.isEdit = !!this.rule;
    this.form = this.fb.group({
      sistema: [{ value: 'ODIN', disabled: true }],
      categoria: [this.rule?.categoria || '', [Validators.required, Validators.minLength(3)]],
      perfil: [this.rule?.perfil || '', [Validators.required]],
      condicoes: [this.rule?.condicoes || '', [Validators.required, Validators.minLength(10)]],
      situacao: [this.rule?.situacao || 'ATIVO', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const value = this.form.getRawValue();
      this.save.emit({
        sistema: 'ODIN',
        categoria: value.categoria,
        perfil: value.perfil,
        condicoes: value.condicoes,
        situacao: value.situacao
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
