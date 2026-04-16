import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { FilterBarComponent } from '../../shared/components/filter-bar/filter-bar.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ActionMenuComponent } from '../../shared/components/action-menu/action-menu.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { ToastService } from '../../shared/services/toast.service';
import { OdinUserService, OdinUser } from '../services/odin-user.service';

@Component({
  selector: 'app-odin-management-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    FilterBarComponent,
    DataTableComponent,
    StatusBadgeComponent,
    ActionMenuComponent,
    ToastComponent
  ],
  templateUrl: './management-panel.component.html',
  styleUrl: './management-panel.component.scss'
})
export class OdinManagementPanelComponent implements OnInit {
  users = signal<OdinUser[]>([]);
  totalElements = signal(0);
  currentPage = signal(0);
  pageSize = signal(10);
  loading = signal(false);
  lastUpdate = signal('');
  processingTime = signal('');

  filters: Record<string, string> = {
    cpf: '',
    nome: '',
    lotacao: '',
    categoriaFuncional: '',
    situacao: '',
    perfil: ''
  };

  filterConfig = [
    { key: 'cpf', label: 'CPF / Título', type: 'text' as const },
    { key: 'nome', label: 'Nome', type: 'text' as const },
    { key: 'lotacao', label: 'Lotação', type: 'text' as const },
    {
      key: 'categoriaFuncional', label: 'Categoria Funcional', type: 'select' as const,
      options: [
        'Todas',
        'Analista Judiciário',
        'Técnico Judiciário',
        'Requisitado',
        'Estagiário'
      ]
    },
    {
      key: 'situacao', label: 'Situação', type: 'select' as const,
      options: [
        'Todas',
        'Ativo',
        'Inativo'
      ]
    },
    {
      key: 'perfil', label: 'Perfil', type: 'select' as const,
      options: [
        'Todos',
        'Administrador',
        'Operador',
        'Consultor'
      ]
    }
  ];

  columns = [
    { key: 'cpf', label: 'CPF', type: 'mono' as const },
    { key: 'nome', label: 'Nome' },
    { key: 'email', label: 'Email' },
    { key: 'categoriaFuncional', label: 'Categoria Funcional' },
    { key: 'lotacao', label: 'Lotação' },
    { key: 'perfil', label: 'Perfil' },
    { key: 'situacao', label: 'Situação', type: 'badge' as const },
    { key: 'origem', label: 'Origem' },
    { key: 'acoes', label: 'Ações', type: 'actions' as const }
  ];

  totalPages = computed(() => Math.ceil(this.totalElements() / this.pageSize()));

  constructor(
    private odinUserService: OdinUserService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.odinUserService.getUsers(this.filters, this.currentPage(), this.pageSize()).subscribe({
      next: (result) => {
        this.users.set(result.content);
        this.totalElements.set(result.totalElements);
        this.lastUpdate.set(result.lastUpdate);
        this.processingTime.set(result.processingTime);
        this.loading.set(false);
      },
      error: () => {
        this.toastService.error('Erro ao carregar usuários do ODIN.');
        this.loading.set(false);
      }
    });
  }

  onFilterChange(filters: Record<string, string>): void {
    this.filters = { ...filters };
    this.currentPage.set(0);
    this.loadUsers();
  }

  onFilterClear(): void {
    this.filters = { cpf: '', nome: '', lotacao: '', categoriaFuncional: '', situacao: '', perfil: '' };
    this.currentPage.set(0);
    this.loadUsers();
  }

  onPageChange(event: { page: number; pageSize: number }): void {
    this.currentPage.set(event.page);
    this.loadUsers();
  }

  onRowAction(action: string, row: any): void {
    console.log('Action:', action, 'Row:', row);
  }

  navigateToRules(): void {
    this.router.navigate(['/odin/rules']);
  }
}
