import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { FilterBarComponent } from '../../shared/components/filter-bar/filter-bar.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { ToastService } from '../../shared/services/toast.service';
import { TremaUserService, TremaUser } from '../services/trema-user.service';

@Component({
  selector: 'app-trema-management-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    FilterBarComponent,
    StatusBadgeComponent,
    ConfirmModalComponent,
    ToastComponent
  ],
  templateUrl: './management-panel.component.html',
  styleUrl: './management-panel.component.scss'
})
export class TremaManagementPanelComponent implements OnInit {
  users = signal<TremaUser[]>([]);
  totalElements = signal(0);
  currentPage = signal(0);
  pageSize = signal(10);
  loading = signal(false);
  processing = signal(false);
  lastUpdate = signal('');
  processingTime = signal('');
  showProcessConfirm = signal(false);

  filters: Record<string, any> = {
    tituloOuCpf: '',
    nome: '',
    lotacao: '',
    possuiLotacao: '',
    categoriaFuncional: [],
    possuiLdap: '',
    possuiRede: '',
    situacao: ''
  };

  lotacaoOptions = [
    'Secretaria de Tecnologia da Informação',
    'Coordenadoria de Eleições',
    'Secretaria Judiciária',
    'Gabinete da Presidência',
    'Secretaria de Gestão de Pessoas',
    'Zona Eleitoral - 1ª ZE São Luís',
    'Zona Eleitoral - 2ª ZE São Luís',
    'Zona Eleitoral - 3ª ZE Imperatriz',
    'Zona Eleitoral - 4ª ZE Caxias',
    'Assessoria de Comunicação Social',
    'Corregedoria Regional Eleitoral',
    'Secretaria de Administração e Orçamento'
  ];

  categoriaOptions = [
    'Analista Judiciário',
    'Técnico Judiciário',
    'Requisitado',
    'Estagiário'
  ];

  filterConfig = [
    { key: 'tituloOuCpf', label: 'Título Eleitoral / CPF', type: 'text' as const },
    { key: 'nome', label: 'Nome', type: 'text' as const },
    {
      key: 'lotacao', label: 'Lotação', type: 'select' as const,
      options: ['Todas', ...this.lotacaoOptions]
    },
    {
      key: 'possuiLotacao', label: 'Possui Lotação?', type: 'select' as const,
      options: ['Todos', 'Sim', 'Não']
    },
    {
      key: 'categoriaFuncional', label: 'Categoria Funcional', type: 'multiselect' as const,
      options: this.categoriaOptions
    },
    {
      key: 'possuiLdap', label: 'Possui conta no LDAP?', type: 'select' as const,
      options: ['Todos', 'Sim', 'Não']
    },
    {
      key: 'possuiRede', label: 'Possui acesso à Rede?', type: 'select' as const,
      options: ['Todos', 'Sim', 'Não']
    },
    {
      key: 'situacao', label: 'Situação', type: 'select' as const,
      options: ['Todas', 'Ativo', 'Inativo']
    }
  ];

  columns = [
    { key: 'id', label: 'Identificação' },
    { key: 'tituloEleitoral', label: 'Título Eleitoral', type: 'mono' as const },
    { key: 'nome', label: 'Nome' },
    { key: 'email', label: 'Email' },
    { key: 'dataNascimento', label: 'Data Nascimento' },
    { key: 'genero', label: 'Gênero' },
    { key: 'categoriaFuncional', label: 'Categoria Funcional' },
    { key: 'lotacao', label: 'Lotação' },
    { key: 'pontoAtendimento', label: 'Ponto Atendimento' },
    { key: 'mencaoAtendimento', label: 'Menção Atendimento' },
    { key: 'possuiLdap', label: 'Possui LDAP?', type: 'boolean' as const },
    { key: 'login', label: 'Login', type: 'boolean' as const },
    { key: 'dataCriacaoConta', label: 'Criação Conta' },
    { key: 'dataModificacaoConta', label: 'Modificação Conta' },
    { key: 'ultimoLogin', label: 'Último Login' },
    { key: 'expiracaoSenha', label: 'Expiração Senha' },
    { key: 'expiracaoConta', label: 'Expiração Conta' },
    { key: 'dataFileAcesso', label: 'Data File Acesso' },
    { key: 'situacao', label: 'Situação', type: 'badge' as const }
  ];

  totalPages = computed(() => Math.ceil(this.totalElements() / this.pageSize()));

  constructor(
    private tremaUserService: TremaUserService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.tremaUserService.getUsers(this.filters, this.currentPage(), this.pageSize()).subscribe({
      next: (result) => {
        this.users.set(result.content);
        this.totalElements.set(result.totalElements);
        this.lastUpdate.set(result.lastUpdate);
        this.processingTime.set(result.processingTime);
        this.loading.set(false);
      },
      error: () => {
        this.toastService.error('Erro ao carregar usuários do TRE-MA.');
        this.loading.set(false);
      }
    });
  }

  onFilterChange(filters: Record<string, any>): void {
    this.filters = { ...filters };
    this.currentPage.set(0);
    this.loadUsers();
  }

  onFilterClear(): void {
    this.filters = { tituloOuCpf: '', nome: '', lotacao: '', possuiLotacao: '', categoriaFuncional: [], possuiLdap: '', possuiRede: '', situacao: '' };
    this.currentPage.set(0);
    this.loadUsers();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadUsers();
  }

  navigateToHistory(): void {
    this.router.navigate(['/trema/processing-history']);
  }

  openProcessConfirm(): void {
    this.showProcessConfirm.set(true);
  }

  confirmProcess(): void {
    this.showProcessConfirm.set(false);
    this.processing.set(true);
    this.tremaUserService.processUsers().subscribe({
      next: (result) => {
        this.processing.set(false);
        this.toastService.success(result.message);
        this.loadUsers();
      },
      error: () => {
        this.processing.set(false);
        this.toastService.error('Erro ao processar usuários do TRE-MA.');
      }
    });
  }

  cancelProcess(): void {
    this.showProcessConfirm.set(false);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateStr;
    }
  }
}
