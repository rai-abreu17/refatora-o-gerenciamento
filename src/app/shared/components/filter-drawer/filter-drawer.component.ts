import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface DrawerFilter {
  key: string;
  label: string;
  type: 'text' | 'select' | 'number';
  placeholder?: string;
  options?: string[];
}

@Component({
  selector: 'app-filter-drawer',
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (isOpen()) {
      <div class="drawer-backdrop" (click)="onClose()"></div>
      <aside class="drawer-panel">
        <div class="drawer-header">
          <h5 class="drawer-header__title">Filtros Avancados</h5>
          <button type="button" class="btn-close" (click)="onClose()"></button>
        </div>
        <div class="drawer-body">
          @for (filter of filters(); track filter.key) {
            <div class="drawer-field">
              <label class="drawer-field__label" [for]="'df-' + filter.key">
                {{ filter.label }}
              </label>
              @if (filter.type === 'text' || filter.type === 'number') {
                <input
                  [id]="'df-' + filter.key"
                  [type]="filter.type"
                  class="form-control form-control-sm"
                  [placeholder]="filter.placeholder ?? ''"
                  [ngModel]="values[filter.key] ?? ''"
                  (ngModelChange)="onValueChange(filter.key, $event)" />
              } @else {
                <select
                  [id]="'df-' + filter.key"
                  class="form-select form-select-sm"
                  [ngModel]="values[filter.key] ?? ''"
                  (ngModelChange)="onValueChange(filter.key, $event)">
                  <option value="">Todos</option>
                  @for (opt of filter.options; track opt) {
                    <option [value]="opt">{{ opt }}</option>
                  }
                </select>
              }
            </div>
          }
        </div>
        <div class="drawer-footer">
          <button class="btn btn-outline-secondary btn-sm me-2" (click)="onClearDrawer()">
            Limpar
          </button>
          <button class="btn btn-primary btn-sm flex-grow-1" (click)="onApply()">
            Aplicar Filtros
          </button>
        </div>
      </aside>
    }
  `,
  styles: [`
    .drawer-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      z-index: 1040;
      animation: fadeIn 0.15s ease;
    }
    .drawer-panel {
      position: fixed;
      top: 0;
      right: 0;
      width: 340px;
      height: 100vh;
      background: #fff;
      z-index: 1045;
      display: flex;
      flex-direction: column;
      box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
      animation: slideIn 0.2s ease;
    }
    .drawer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid var(--color-border, #dee2e6);
      flex-shrink: 0;
    }
    .drawer-header__title {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
    }
    .drawer-body {
      flex: 1;
      overflow-y: auto;
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .drawer-field__label {
      font-size: 0.72rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: var(--color-text-secondary, #5A6472);
      margin-bottom: 3px;
      display: block;
    }
    .drawer-footer {
      padding: 12px 20px;
      border-top: 1px solid var(--color-border, #dee2e6);
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideIn {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
  `],
})
export class FilterDrawerComponent {
  filters = input.required<DrawerFilter[]>();
  isOpen = input.required<boolean>();
  close = output<void>();
  apply = output<Record<string, any>>();

  values: Record<string, any> = {};

  onValueChange(key: string, value: any): void {
    this.values = { ...this.values, [key]: value };
  }

  onApply(): void {
    this.apply.emit({ ...this.values });
    this.close.emit();
  }

  onClearDrawer(): void {
    this.values = {};
  }

  onClose(): void {
    this.close.emit();
  }
}
