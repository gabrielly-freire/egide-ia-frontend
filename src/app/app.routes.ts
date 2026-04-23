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
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: Home,
        title: 'Egide - Home'
      },
      {
        path: 'cadastrar-manifestacao',
        loadComponent: () =>
          import('./pages/report-registration/report-registration').then(
            m => m.ReportRegistration
          ),
        title: 'Egide - Nova Manifestacao'
      },
      {
        path: 'manifestacoes',
        loadComponent: () =>
          import('./pages/report-list/report-list').then(m => m.ReportList),
        title: 'Egide - Manifestacoes'
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./pages/user-management/user-management').then(
            m => m.UserManagement
          ),
        title: 'Egide - Usuarios'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
