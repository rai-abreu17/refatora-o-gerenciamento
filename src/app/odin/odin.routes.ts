import { Routes } from '@angular/router';
import { OdinManagementPanelComponent } from './management-panel/management-panel.component';
import { OdinRulesComponent } from './rules/rules.component';

export const ODIN_ROUTES: Routes = [
  { path: 'management', component: OdinManagementPanelComponent },
  { path: 'rules', component: OdinRulesComponent },
  { path: '', redirectTo: 'management', pathMatch: 'full' }
];
