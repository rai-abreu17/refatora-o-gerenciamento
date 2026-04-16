import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { ToastService } from '../../shared/services/toast.service';
import { OdinRuleService, OdinRule } from '../services/odin-rule.service';
import { OdinRuleFormComponent } from './components/odin-rule-form/odin-rule-form.component';

@Component({
  selector: 'app-odin-rules',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    StatusBadgeComponent,
    ConfirmModalComponent,
    ToastComponent,
    OdinRuleFormComponent
  ],
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.scss'
})
export class OdinRulesComponent implements OnInit {
  rules = signal<OdinRule[]>([]);
  totalElements = signal(0);
  currentPage = signal(0);
  pageSize = signal(10);
  loading = signal(false);
  searchTerm = signal('');

  showFormModal = signal(false);
  showDeleteModal = signal(false);
  editingRule = signal<OdinRule | null>(null);
  deletingRule = signal<OdinRule | null>(null);

  columns = [
    { key: 'sistema', label: 'Sistema' },
    { key: 'categoria', label: 'Categoria / Dimensão' },
    { key: 'perfil', label: 'Perfil' },
    { key: 'condicoes', label: 'Condições' },
    { key: 'situacao', label: 'Situação', type: 'badge' as const },
    { key: 'acoes', label: 'Ações', type: 'actions' as const }
  ];

  totalPages = computed(() => Math.ceil(this.totalElements() / this.pageSize()));

  constructor(
    private odinRuleService: OdinRuleService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRules();
  }

  loadRules(): void {
    this.loading.set(true);
    this.odinRuleService.getRules(this.currentPage(), this.pageSize(), this.searchTerm()).subscribe({
      next: (result) => {
        this.rules.set(result.content);
        this.totalElements.set(result.totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.toastService.error('Erro ao carregar regras do ODIN.');
        this.loading.set(false);
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(0);
    this.loadRules();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadRules();
  }

  openCreateModal(): void {
    this.editingRule.set(null);
    this.showFormModal.set(true);
  }

  openEditModal(rule: OdinRule): void {
    this.editingRule.set({ ...rule });
    this.showFormModal.set(true);
  }

  openDeleteModal(rule: OdinRule): void {
    this.deletingRule.set(rule);
    this.showDeleteModal.set(true);
  }

  onSaveRule(ruleData: Partial<OdinRule>): void {
    const editing = this.editingRule();
    if (editing) {
      this.odinRuleService.updateRule(editing.id, ruleData).subscribe({
        next: () => {
          this.toastService.success('Regra atualizada com sucesso.');
          this.showFormModal.set(false);
          this.loadRules();
        },
        error: () => this.toastService.error('Erro ao atualizar regra.')
      });
    } else {
      this.odinRuleService.createRule(ruleData).subscribe({
        next: () => {
          this.toastService.success('Regra criada com sucesso.');
          this.showFormModal.set(false);
          this.loadRules();
        },
        error: () => this.toastService.error('Erro ao criar regra.')
      });
    }
  }

  confirmDelete(): void {
    const rule = this.deletingRule();
    if (rule) {
      this.odinRuleService.deleteRule(rule.id).subscribe({
        next: () => {
          this.toastService.success('Regra excluída com sucesso.');
          this.showDeleteModal.set(false);
          this.deletingRule.set(null);
          this.loadRules();
        },
        error: () => this.toastService.error('Erro ao excluir regra.')
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.deletingRule.set(null);
  }

  onCancelForm(): void {
    this.showFormModal.set(false);
    this.editingRule.set(null);
  }

  goBack(): void {
    this.router.navigate(['/odin/management']);
  }
}
