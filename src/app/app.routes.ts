import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pje/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'pje',
    loadChildren: () => import('./pje/pje.routes').then((m) => m.PJE_ROUTES),
  },
  {
    path: 'odin',
    loadChildren: () => import('./odin/odin.routes').then((m) => m.ODIN_ROUTES),
  },
  {
    path: 'trema',
    loadChildren: () => import('./trema/trema.routes').then((m) => m.TREMA_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'pje/dashboard',
  },
];
