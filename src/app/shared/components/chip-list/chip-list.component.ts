import { Component, input } from '@angular/core';

@Component({
  selector: 'app-chip-list',
  standalone: true,
  template: `
    <div class="chip-list">
      @for (item of items(); track item) {
        <span class="chip">{{ item.trim() }}</span>
      }
    </div>
  `,
  styles: [`
    .chip-list {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    .chip {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 0.72rem;
      font-weight: 500;
      background: rgba(27, 79, 138, 0.08);
      color: var(--color-primary, #1B4F8A);
      white-space: nowrap;
      line-height: 1.4;
    }
  `],
})
export class ChipListComponent {
  items = input.required<string[]>();
}
