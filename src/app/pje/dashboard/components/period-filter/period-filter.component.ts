import { Component, input, output } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

export type Granularity = 'day' | 'week' | 'month' | 'year';

@Component({
  selector: 'app-period-filter',
  standalone: true,
  imports: [MatButtonToggleModule],
  template: `
    <mat-button-toggle-group [value]="selected()" (change)="change.emit($event.value)" aria-label="Periodo">
      <mat-button-toggle value="day">Dia</mat-button-toggle>
      <mat-button-toggle value="week">Semana</mat-button-toggle>
      <mat-button-toggle value="month">Mes</mat-button-toggle>
      <mat-button-toggle value="year">Ano</mat-button-toggle>
    </mat-button-toggle-group>
  `,
  styles: [`:host { display: inline-block; }`]
})
export class PeriodFilterComponent {
  selected = input<Granularity>('day');
  change = output<Granularity>();
}
