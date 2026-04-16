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
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusChipComponent } from '../../shared/components/status-chip/status-chip.component';
import { RemovalDetailDialogComponent } from './components/removal-detail-dialog/removal-detail-dialog.component';

import { RemovalHistoryService, RemovalRecord } from '../services/removal-history.service';

@Component({
  selector: 'app-removal-history',
  standalone: true,
  imports: [
    RouterModule, FormsModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatChipsModule,
    MatProgressSpinnerModule, MatTooltipModule, MatTabsModule,
    PageHeaderComponent, StatusChipComponent,
  ],
  templateUrl: './removal-history.component.html',
  styleUrl: './removal-history.component.scss',
})
export class RemovalHistoryComponent implements OnInit, AfterViewInit {
  private historyService = inject(RemovalHistoryService);
  private dialog = inject(MatDialog);

  readonly paginator = viewChild(MatPaginator);
  readonly sort = viewChild(MatSort);

  allRecords: RemovalRecord[] = [];
  dataSource = new MatTableDataSource<RemovalRecord>();
  loading = signal(false);
  total = signal(0);
  activeTab = 0;

  displayedColumns = ['nome', 'sistema', 'perfil', 'tipoRemocao', 'dataRemocao', 'situacao', 'detalhes'];

  ngOnInit(): void {
    this.loadHistory();
  }

  ngAfterViewInit(): void {
    if (this.paginator()) this.dataSource.paginator = this.paginator()!;
    if (this.sort()) this.dataSource.sort = this.sort()!;
  }

  loadHistory(): void {
    this.loading.set(true);
    this.historyService.getHistory(0, 100, '').subscribe(res => {
      this.allRecords = res.data;
      this.total.set(res.total);
      this.applyTabFilter();
      this.loading.set(false);
    });
  }

  onTabChange(index: number): void {
    this.activeTab = index;
    this.applyTabFilter();
  }

  applyTabFilter(): void {
    switch (this.activeTab) {
      case 1:
        this.dataSource.data = this.allRecords.filter(r => r.tipoRemocao === 'Manual');
        break;
      case 2:
        this.dataSource.data = this.allRecords.filter(r => r.tipoRemocao === 'Automatico');
        break;
      default:
        this.dataSource.data = this.allRecords;
    }
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  openDetail(record: RemovalRecord): void {
    this.dialog.open(RemovalDetailDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: record,
    });
  }
}
