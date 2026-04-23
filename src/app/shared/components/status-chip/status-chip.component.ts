import { Component, input, computed } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-status-chip',
  standalone: true,
  imports: [MatChipsModule, MatIconModule],
  template: `
    <mat-chip [highlighted]="highlighted()" [class]="chipClass()">
      <mat-icon matChipAvatar>{{ iconName() }}</mat-icon>
      {{ status() }}
    </mat-chip>
  `,
  styles: [`
    .status-active { --mdc-chip-elevated-container-color: #E8F5E9; --mdc-chip-label-text-color: #2E7D32; }
    .status-inactive { --mdc-chip-elevated-container-color: #FFEBEE; --mdc-chip-label-text-color: #C62828; }
    .status-warning { --mdc-chip-elevated-container-color: #FFF3E0; --mdc-chip-label-text-color: #E65100; }
    .status-gray { --mdc-chip-elevated-container-color: #ECEFF1; --mdc-chip-label-text-color: #546E7A; }
  `]
})
export class StatusChipComponent {
  status = input.required<string>();

  highlighted = computed(() => {
    const s = this.status().toLowerCase();
    return ['ativo', 'vigente', 'sim'].includes(s);
  });

  chipClass = computed(() => {
    const s = this.status().toLowerCase();
    if (['ativo', 'vigente', 'sim'].includes(s)) return 'status-active';
    if (['inativo', 'expirado', 'não', 'nao'].includes(s)) return 'status-inactive';
    if (['inexistente'].includes(s)) return 'status-gray';
    if (['sem vínculo', 'sem vinculo'].includes(s)) return 'status-warning';
    return 'status-warning';
  });

  iconName = computed(() => {
    const s = this.status().toLowerCase();
    if (['ativo', 'vigente', 'sim'].includes(s)) return 'check_circle';
    if (['inativo', 'expirado', 'não', 'nao'].includes(s)) return 'cancel';
    return 'help_outline';
  });
}
