import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface AccessDataPoint {
  period: string;
  count: number;
}

export interface AccessCountResponse {
  data: AccessDataPoint[];
  total: number;
  peak: AccessDataPoint;
  lowest: AccessDataPoint;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {

  getAccessCount(
    sistema: string,
    granularity: 'day' | 'week' | 'month' | 'year',
    startDate: string,
    endDate: string
  ): Observable<AccessCountResponse> {
    const data = this.generateMockData(sistema, granularity, startDate, endDate);
    const total = data.reduce((sum, d) => sum + d.count, 0);
    const peak = data.reduce((max, d) => d.count > max.count ? d : max, data[0]);
    const lowest = data.reduce((min, d) => d.count < min.count ? d : min, data[0]);

    return of({ data, total, peak, lowest }).pipe(delay(400));
  }

  private generateMockData(
    sistema: string,
    granularity: string,
    startDate: string,
    endDate: string
  ): AccessDataPoint[] {
    const points: AccessDataPoint[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const baseCount = sistema === 'PJe 1G' ? 1200 : 800;
    const variance = sistema === 'PJe 1G' ? 600 : 400;

    const current = new Date(start);
    while (current <= end) {
      const dayOfWeek = current.getDay();
      const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.3 : 1;
      const count = Math.round(
        (baseCount + (Math.random() - 0.5) * variance * 2) * weekendFactor
      );

      points.push({
        period: current.toISOString().split('T')[0],
        count: Math.max(50, count)
      });

      switch (granularity) {
        case 'day': current.setDate(current.getDate() + 1); break;
        case 'week': current.setDate(current.getDate() + 7); break;
        case 'month': current.setMonth(current.getMonth() + 1); break;
        case 'year': current.setFullYear(current.getFullYear() + 1); break;
      }
    }

    return points;
  }
}
