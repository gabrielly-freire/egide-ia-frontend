import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'cadastrar-manifestacao',
    loadComponent: () => import('./pages/report-registration/report-registration').then(m => m.ReportRegistration),
    title: 'Égide - Nova Manisfestação'
  }
];
