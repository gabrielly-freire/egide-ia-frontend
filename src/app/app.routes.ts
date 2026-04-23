import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Layout } from './layout/layout';
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    title: 'Egide - Login'
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: Home,
        title: 'Égide - Início'
      },
      {
        path: 'cadastrar-manifestacao',
        loadComponent: () =>
          import('./pages/report-registration/report-registration').then(m => m.ReportRegistration),
        title: 'Égide - Nova Manifestação'
      },
      {
        path: 'manifestacoes',
        loadComponent: () => import('./pages/report-list/report-list').then(m => m.ReportList),
        title: 'Égide - Manifestações'
      },
      {
        path: 'manifestacoes/:id/responder',
        loadComponent: () =>
          import('./pages/report-response/report-response').then(m => m.ReportResponse),
        title: 'Égide - Responder Manifestação'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
        title: 'Égide - Dashboard'
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./pages/user-management/user-management').then(m => m.UserManagement),
        title: 'Égide - Usuários'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
