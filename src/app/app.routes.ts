import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import {Login} from './pages/login/login';
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
  },
  {
    path: 'manifestacoes',
    loadComponent: () => import('./pages/report-list/report-list').then(m => m.ReportList),
    title: 'Égide - Manifestações'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
    title: 'Égide - Dashboard'
  },
  {
    path: 'usuarios',
    loadComponent: () =>
      import('./pages/user-management/user-management').then(
        m => m.UserManagement
      ),
    title: 'Egide - Usuarios'
  }
];
