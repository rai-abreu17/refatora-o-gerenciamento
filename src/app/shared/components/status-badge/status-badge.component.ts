import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.scss',
})
export class StatusBadgeComponent {
  status = input.required<string>();

  badgeClass = computed(() => {
    const s = this.status().toLowerCase();
    if (['ativo', 'vigente', 'sim'].includes(s)) return 'badge-active';
    if (['inativo', 'expirado', 'não', 'nao'].includes(s)) return 'badge-inactive';
    if (['inexistente', 'sem vínculo', 'sem vinculo'].includes(s)) return 'badge-gray';
    return 'badge-secondary';
  });
}
