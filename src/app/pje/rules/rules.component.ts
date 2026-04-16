import { Component, OnInit, signal, inject, viewChild, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusChipComponent } from '../../shared/components/status-chip/status-chip.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { RuleFormDialogComponent } from './components/rule-form/rule-form.component';

import { PjeRuleService, PjeRule } from '../services/pje-rule.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-rules',
  standalone: true,
  imports: [
    RouterModule, FormsModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatMenuModule, MatChipsModule,
    MatProgressSpinnerModule, MatTooltipModule,
    PageHeaderComponent, StatusChipComponent,
  ],
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.scss',
})
export class RulesComponent implements OnInit, AfterViewInit {
  private ruleService = inject(PjeRuleService);
  private toastService = inject(ToastService);
  private dialog = inject(MatDialog);

  readonly paginator = viewChild(MatPaginator);
  readonly sort = viewChild(MatSort);

  dataSource = new MatTableDataSource<PjeRule>();
  loading = signal(false);
  total = signal(0);
  searchTerm = '';

  displayedColumns = ['sistema', 'origem', 'lotacao', 'funcao', 'perfil', 'situacaoFuncional', 'acoes'];

  ngOnInit(): void {
    this.loadRules();
  }

  ngAfterViewInit(): void {
    if (this.paginator()) this.dataSource.paginator = this.paginator()!;
    if (this.sort()) this.dataSource.sort = this.sort()!;
  }

  loadRules(): void {
    this.loading.set(true);
    this.ruleService.getRules(0, 100, this.searchTerm).subscribe(res => {
      this.dataSource.data = res.data;
      this.total.set(res.total);
      this.loading.set(false);
    });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  openCreateForm(): void {
    const dialogRef = this.dialog.open(RuleFormDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      data: { rule: null },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ruleService.createRule(result).subscribe(() => {
          this.toastService.success('Regra criada com sucesso.');
          this.loadRules();
        });
      }
    });
  }

  openEditForm(rule: PjeRule): void {
    const dialogRef = this.dialog.open(RuleFormDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      data: { rule },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ruleService.updateRule(rule.id, result).subscribe(() => {
          this.toastService.success('Regra atualizada com sucesso.');
          this.loadRules();
        });
      }
    });
  }

  confirmDelete(rule: PjeRule): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Excluir Regra',
        message: `Tem certeza que deseja excluir a regra #${rule.id}?`,
        confirmLabel: 'Excluir',
      },
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.ruleService.deleteRule(rule.id).subscribe(success => {
          if (success) {
            this.toastService.success('Regra excluida com sucesso.');
          } else {
            this.toastService.error('Erro ao excluir regra.');
          }
          this.loadRules();
        });
      }
    });
  }

  getPerfilChips(perfil: string): string[] {
    return perfil.split(';').map(p => p.trim()).filter(Boolean);
  }
}
