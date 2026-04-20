import { Component, input } from '@angular/core';
import { ComplianceMetric } from '../../dashboard.model';

@Component({
  selector: 'app-compliance-footer',
  standalone: true,
  templateUrl: './compliance-footer.component.html',
  styleUrl: './compliance-footer.component.scss',
})
export class ComplianceFooterComponent {
  metrics = input.required<ComplianceMetric[]>();

  pct(m: ComplianceMetric): number {
    if (!m.total) return 0;
    return Math.round((m.value / m.total) * 1000) / 10;
  }

  pctFmt(m: ComplianceMetric): string {
    return this.pct(m).toLocaleString('pt-BR', { minimumFractionDigits: 1 });
  }
}
