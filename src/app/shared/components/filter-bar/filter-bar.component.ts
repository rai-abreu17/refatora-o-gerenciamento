import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'number';
  options?: string[];
}

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
})
export class FilterBarComponent {
  filters = input.required<FilterConfig[]>();
  search = output<Record<string, any>>();
  clear = output<void>();

  collapsed = signal(false);
  filterValues: Record<string, any> = {};

  toggleCollapse(): void {
    this.collapsed.update((v) => !v);
  }

  onSearch(): void {
    this.search.emit({ ...this.filterValues });
  }

  onClear(): void {
    this.filterValues = {};
    this.clear.emit();
  }

  onMultiselectChange(key: string, option: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (!this.filterValues[key]) this.filterValues[key] = [];
    if (checked) {
      this.filterValues[key].push(option);
    } else {
      this.filterValues[key] = this.filterValues[key].filter((v: string) => v !== option);
    }
  }

  isMultiselectChecked(key: string, option: string): boolean {
    return Array.isArray(this.filterValues[key]) && this.filterValues[key].includes(option);
  }
}
