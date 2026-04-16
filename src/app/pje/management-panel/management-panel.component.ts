import { Component, OnInit, signal, inject, viewChild, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusChipComponent } from '../../shared/components/status-chip/status-chip.component';
import { AuthorizationDialogComponent } from './components/authorization-dialog/authorization-dialog.component';
import { AdvancedFiltersComponent } from './components/advanced-filters/advanced-filters.component';

import { PjeUserService, PjeUser } from '../services/pje-user.service';
import { formatCpf } from '../../shared/validators/cpf.validator';

@Component({
  selector: 'app-management-panel',
  standalone: true,
  imports: [
    RouterModule, FormsModule,
    MatSidenavModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatMenuModule, MatChipsModule,
    MatProgressSpinnerModule, MatTooltipModule,
    PageHeaderComponent, StatusChipComponent, AdvancedFiltersComponent,
  ],
  templateUrl: './management-panel.component.html',
  styleUrl: './management-panel.component.scss',
})
export class ManagementPanelComponent implements OnInit, AfterViewInit {
  private userService = inject(PjeUserService);
  private dialog = inject(MatDialog);

  readonly paginator = viewChild(MatPaginator);
  readonly sort = viewChild(MatSort);
  readonly filterDrawer = viewChild<MatSidenav>('filterDrawer');

  dataSource = new MatTableDataSource<PjeUser>();
  loading = signal(false);
  total = signal(0);
  lastUpdate = signal('');
  processingTime = signal('');
  activeFilters = signal<Record<string, string>>({});

  // Quick filter values
  quickCpf = '';
  quickNome = '';
  quickSistema = '';
  quickSituacao = '';

  displayedColumns = ['cpf', 'nome', 'situacao', 'origem', 'categoriaFuncional', 'lotacao', 'todosPerfisValidados', 'acoes'];

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    if (this.paginator()) this.dataSource.paginator = this.paginator()!;
    if (this.sort()) this.dataSource.sort = this.sort()!;
  }

  loadUsers(filters: Record<string, any> = {}): void {
    this.loading.set(true);
    this.userService.getUsers(filters, 0, 50).subscribe(res => {
      this.dataSource.data = res.data.map(u => ({ ...u, cpf: formatCpf(u.cpf) }));
      this.total.set(res.total);
      this.lastUpdate.set(res.lastUpdate);
      this.processingTime.set(res.processingTime);
      this.loading.set(false);
    });
  }

  onQuickSearch(): void {
    const filters: Record<string, string> = {
      ...this.activeFilters(),
    };
    if (this.quickCpf) filters['cpf'] = this.quickCpf;
    if (this.quickNome) filters['nome'] = this.quickNome;
    if (this.quickSistema) filters['sistema'] = this.quickSistema;
    if (this.quickSituacao) filters['situacao'] = this.quickSituacao;
    this.loadUsers(filters);
  }

  onQuickClear(): void {
    this.quickCpf = '';
    this.quickNome = '';
    this.quickSistema = '';
    this.quickSituacao = '';
    this.activeFilters.set({});
    this.loadUsers();
  }

  toggleFilterDrawer(): void {
    this.filterDrawer()?.toggle();
  }

  onApplyAdvancedFilters(filters: Record<string, string>): void {
    this.activeFilters.set(filters);
    this.filterDrawer()?.close();
    this.loadUsers({ ...filters, cpf: this.quickCpf, nome: this.quickNome, sistema: this.quickSistema, situacao: this.quickSituacao });
  }

  removeFilter(key: string): void {
    const filters = { ...this.activeFilters() };
    delete filters[key];
    this.activeFilters.set(filters);
    this.loadUsers(filters);
  }

  get activeFilterEntries(): [string, string][] {
    return Object.entries(this.activeFilters());
  }

  openAuthorizationDialog(user: PjeUser): void {
    this.dialog.open(AuthorizationDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      data: { userId: user.id, userName: user.nome },
    });
  }

  applyTableFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }
}
