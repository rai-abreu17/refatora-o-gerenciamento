import { Component, computed, input } from '@angular/core';
import { LastAccessBucket } from '../../dashboard.model';
import { InfoTooltipComponent } from '../../../../shared/components/info-tooltip/info-tooltip.component';

@Component({
  selector: 'app-last-access-buckets',
  standalone: true,
  imports: [InfoTooltipComponent],
  templateUrl: './last-access-buckets.component.html',
  styleUrl: './last-access-buckets.component.scss',
})
export class LastAccessBucketsComponent {
  buckets = input.required<LastAccessBucket[]>();

  total = computed(() => this.buckets().reduce((s, b) => s + b.count, 0));

  percent(count: number): number {
    const t = this.total();
    if (!t) return 0;
    return Math.round((count / t) * 1000) / 10;
  }

  nunca = computed(() => this.buckets().find((b) => b.key === 'never'));
  outras = computed(() => this.buckets().filter((b) => b.key !== 'never'));
}
