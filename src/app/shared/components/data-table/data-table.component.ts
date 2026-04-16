import { Component, input, output, signal, computed, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'date' | 'badge' | 'mono' | 'boolean' | 'actions';
  sortable?: boolean;
}

export interface SortEvent {
  column: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent implements OnInit, OnChanges {
  columns = input.required<TableColumn[]>();
  data = input<any[]>([]);
  loading = input<boolean>(false);
  totalItems = input<number>(0);
  pageSize = input<number>(10);
  pageSizeOptions = input<number[]>([10, 25, 50]);

  pageChange = output<{ page: number; pageSize: number }>();
  sortChange = output<SortEvent>();
  rowAction = output<{ action: string; row: any }>();
  rowExpand = output<any>();

  searchTerm = signal('');
  currentPage = signal(1);
  currentPageSize = signal(10);
  sortColumn = signal('');
  sortDirection = signal<'asc' | 'desc'>('asc');

  filteredData = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const items = this.data();
    if (!term) return items;
    return items.filter((row) =>
      this.columns().some((col) => {
        const val = row[col.key];
        return val != null && String(val).toLowerCase().includes(term);
      })
    );
  });

  displayedData = computed(() => {
    const all = this.filteredData();
    const start = (this.currentPage() - 1) * this.currentPageSize();
    return all.slice(start, start + this.currentPageSize());
  });

  effectiveTotalItems = computed(() => {
    const total = this.totalItems();
    return total > 0 ? total : this.filteredData().length;
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.effectiveTotalItems() / this.currentPageSize())));

  showingFrom = computed(() => {
    const total = this.effectiveTotalItems();
    if (total === 0) return 0;
    return (this.currentPage() - 1) * this.currentPageSize() + 1;
  });

  showingTo = computed(() => Math.min(this.currentPage() * this.currentPageSize(), this.effectiveTotalItems()));

  pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  });

  ngOnInit(): void {
    this.currentPageSize.set(this.pageSize());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pageSize']) {
      this.currentPageSize.set(this.pageSize());
    }
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
  }

  onSort(column: TableColumn): void {
    if (!column.sortable) return;
    if (this.sortColumn() === column.key) {
      this.sortDirection.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(column.key);
      this.sortDirection.set('asc');
    }
    this.sortChange.emit({ column: column.key, direction: this.sortDirection() });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.pageChange.emit({ page, pageSize: this.currentPageSize() });
  }

  onPageSizeChange(size: number): void {
    this.currentPageSize.set(size);
    this.currentPage.set(1);
    this.pageChange.emit({ page: 1, pageSize: size });
  }

  onRowAction(action: string, row: any): void {
    this.rowAction.emit({ action, row });
  }

  getSortIcon(col: TableColumn): string {
    if (!col.sortable) return '';
    if (this.sortColumn() !== col.key) return 'bi-chevron-expand';
    return this.sortDirection() === 'asc' ? 'bi-sort-up' : 'bi-sort-down';
  }
}
