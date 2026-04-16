import { Routes } from '@angular/router';
import { TremaManagementPanelComponent } from './management-panel/management-panel.component';
import { ProcessingHistoryComponent } from './processing-history/processing-history.component';

export const TREMA_ROUTES: Routes = [
  { path: 'management', component: TremaManagementPanelComponent },
  { path: 'processing-history', component: ProcessingHistoryComponent },
  { path: '', redirectTo: 'management', pathMatch: 'full' }
];
