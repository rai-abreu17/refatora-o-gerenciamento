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
      [matTooltipShowDelay]="0"
      matTooltipPosition="above"
      matTooltipClass="info-tooltip-panel"
      [style.color]="color()"
      aria-label="Informações"
      role="img">
      info
    </mat-icon>
  `,
  styles: [`
    :host { 
      display: inline-flex; 
      align-items: center; 
      vertical-align: middle;
      margin-left: 6px;
      position: relative;
      top: -1px;
    }
    .info-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--color-primary, #1B4F8A);
      opacity: 0.9;
      transition: opacity 0.15s ease, color 0.15s ease, transform 0.15s ease;
      user-select: none;
      margin-left: 6px;
      position: relative;
      top: -1px;
    }
    .info-icon:hover {
      opacity: 1;
      transform: scale(1.1);
      color: var(--color-accent, #E8A000);
    }
  `],
})
export class InfoTooltipComponent {
  text  = input.required<string>();
  color = input<string>('var(--color-primary, #1B4F8A)');
}
