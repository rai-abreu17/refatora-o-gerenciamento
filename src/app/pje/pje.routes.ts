import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManagementPanelComponent } from './management-panel/management-panel.component';
import { RulesComponent } from './rules/rules.component';
import { RemovalHistoryComponent } from './removal-history/removal-history.component';
import { WorkGroupsComponent } from './work-groups/work-groups.component';

export const PJE_ROUTES: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'management', component: ManagementPanelComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'removal-history', component: RemovalHistoryComponent },
  { path: 'work-groups', component: WorkGroupsComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
