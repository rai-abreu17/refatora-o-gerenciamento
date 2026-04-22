import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-info-tooltip',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule],
  template: `
    <mat-icon
      class="info-icon"
      [matTooltip]="text()"
      matTooltipPosition="above"
      matTooltipClass="info-tooltip-panel"
      [style.color]="color()"
      aria-label="Informações"
      role="img">
      info_outline
    </mat-icon>
  `,
  styles: [`
    :host { display: inline-flex; align-items: center; }
    .info-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: var(--color-text-secondary, #5A6472);
      cursor: help;
      opacity: 0.7;
      transition: opacity 0.15s ease, color 0.15s ease;
      user-select: none;
    }
    .info-icon:hover {
      opacity: 1;
      color: var(--color-primary, #1B4F8A);
    }
  `],
})
export class InfoTooltipComponent {
  text  = input.required<string>();
  color = input<string>('var(--color-text-secondary, #5A6472)');
}
