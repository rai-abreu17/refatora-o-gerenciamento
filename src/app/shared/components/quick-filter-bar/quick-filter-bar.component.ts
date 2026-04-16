import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface QuickFilter {
  key: string;
  label: string;
  type: 'text' | 'select';
  placeholder?: string;
  options?: { value: string; label: string }[];
}

@Component({
  selector: 'app-quick-filter-bar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="quick-filters">
      <div class="quick-filters__row">
        @for (filter of filters(); track filter.key) {
          <div class="quick-filters__field">
            <label class="quick-filters__label" [for]="'qf-' + filter.key">
              {{ filter.label }}
            </label>
            @if (filter.type === 'text') {
              <input
                [id]="'qf-' + filter.key"
                type="text"
                class="form-control form-control-sm"
                [placeholder]="filter.placeholder ?? ''"
                [ngModel]="values[filter.key] ?? ''"
                (ngModelChange)="onValueChange(filter.key, $event)" />
            } @else {
              <select
                [id]="'qf-' + filter.key"
                class="form-select form-select-sm"
                [ngModel]="values[filter.key] ?? ''"
                (ngModelChange)="onValueChange(filter.key, $event)">
                <option value="">Todos</option>
                @for (opt of filter.options; track opt.value) {
                  <option [value]="opt.value">{{ opt.label }}</option>
                }
              </select>
            }
          </div>
        }
        <div class="quick-filters__actions">
          <button class="btn btn-primary btn-sm" (click)="onSearch()">
            <i class="bi bi-search me-1"></i>Pesquisar
          </button>
          <button class="btn btn-outline-secondary btn-sm" (click)="onClear()">
            Limpar
          </button>
          <button class="btn btn-outline-primary btn-sm" (click)="toggleDrawer.emit()">
            <i class="bi bi-funnel me-1"></i>Filtros Avancados
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quick-filters {
      background: #fff;
      border: 1px solid var(--color-border, #dee2e6);
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 16px;
    }
    .quick-filters__row {
      display: flex;
      align-items: flex-end;
      gap: 12px;
      flex-wrap: wrap;
    }
    .quick-filters__field {
      flex: 1 1 180px;
      max-width: 220px;
    }
    .quick-filters__label {
      font-size: 0.72rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: var(--color-text-secondary, #5A6472);
      margin-bottom: 3px;
      display: block;
    }
    .quick-filters__actions {
      display: flex;
      gap: 8px;
      align-items: flex-end;
      padding-bottom: 1px;
    }
  `],
})
export class QuickFilterBarComponent {
  filters = input.required<QuickFilter[]>();
  search = output<Record<string, any>>();
  clear = output<void>();
  toggleDrawer = output<void>();

  values: Record<string, any> = {};

  onValueChange(key: string, value: string): void {
    this.values = { ...this.values, [key]: value };
  }

  onSearch(): void {
    this.search.emit({ ...this.values });
  }

  onClear(): void {
    this.values = {};
    this.clear.emit();
  }
}
