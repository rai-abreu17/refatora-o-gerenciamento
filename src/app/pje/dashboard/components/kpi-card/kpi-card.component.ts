import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  template: `
    <mat-card class="kpi-card">
      <mat-card-content class="kpi-content">
        <div class="kpi-icon" [style.background-color]="color() + '1a'" [style.color]="color()">
          <mat-icon>{{ matIcon() }}</mat-icon>
        </div>
        <div class="kpi-info">
          <span class="kpi-label">{{ title() }}</span>
          <span class="kpi-value">{{ value() }}</span>
          @if (subtitle()) {
            <span class="kpi-subtitle">{{ subtitle() }}</span>
          }
          @if (trend() !== undefined) {
            <span class="kpi-trend" [class.kpi-trend--up]="trend()! > 0" [class.kpi-trend--down]="trend()! < 0">
              <mat-icon class="kpi-trend-icon">{{ trend()! >= 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
              {{ trend()! > 0 ? '+' : '' }}{{ trend() }}%
              @if (trendLabel()) {
                <span class="kpi-trend-label">{{ trendLabel() }}</span>
              }
            </span>
          }
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .kpi-card { border-left: 4px solid var(--color-primary); transition: box-shadow 0.2s; }
    .kpi-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .kpi-content { display: flex; align-items: center; gap: 16px; padding: 20px !important; }
    .kpi-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .kpi-icon mat-icon { font-size: 28px; width: 28px; height: 28px; }
    .kpi-info { display: flex; flex-direction: column; }
    .kpi-label { font-size: 0.75rem; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.03em; font-weight: 500; }
    .kpi-value { font-size: 1.5rem; font-weight: 700; color: var(--color-text-primary); line-height: 1.2; }
    .kpi-subtitle { font-size: 0.75rem; color: var(--color-text-secondary); margin-top: 2px; }
    .kpi-trend { display: inline-flex; align-items: center; gap: 2px; font-size: 0.75rem; font-weight: 600; margin-top: 4px; }
    .kpi-trend--up { color: #2E7D32; }
    .kpi-trend--down { color: #C62828; }
    .kpi-trend-icon { font-size: 16px; width: 16px; height: 16px; }
    .kpi-trend-label { font-weight: 400; color: var(--color-text-secondary); margin-left: 4px; }
  `]
})
export class KpiCardComponent {
  title = input.required<string>();
  value = input.required<string | number>();
  subtitle = input<string>('');
  icon = input<string>('bi-bar-chart');
  color = input<string>('var(--color-primary)');
  trend = input<number | undefined>(undefined);
  trendLabel = input<string>('');

  /** Map bootstrap icon names to Material icons */
  matIcon(): string {
    const mapping: Record<string, string> = {
      'bi-people': 'people',
      'bi-graph-up-arrow': 'show_chart',
      'bi-graph-down-arrow': 'trending_down',
      'bi-bar-chart': 'bar_chart',
    };
    return mapping[this.icon()] || 'analytics';
  }
}
