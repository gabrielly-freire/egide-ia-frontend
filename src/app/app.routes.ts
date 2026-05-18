import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Layout } from './layout/layout';
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth-guard';
import { landingGuard, roleGuard } from './guards/role-guard';

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
        pathMatch: 'full',
        component: Home,
        canActivate: [landingGuard]
      },
      {
        path: 'home',
        component: Home,
        title: 'Égide - Início'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
        title: 'Égide - Dashboard',
        canActivate: [roleGuard],
        data: { roles: ['LISTENER', 'GENERAL_LISTENER', 'MANAGER', 'ADMIN'] }
      },
      {
        path: 'minhas-manifestacoes',
        loadComponent: () =>
          import('./pages/my-reports/report-list').then(m => m.MyReports),
        title: 'Égide - Minhas Manifestações',
        canActivate: [roleGuard],
        data: { roles: ['REMONSTRANT', 'ADMIN'] }
      },
      {
        path: 'cadastrar-manifestacao',
        loadComponent: () =>
          import('./pages/report-registration/report-registration').then(m => m.ReportRegistration),
        title: 'Égide - Nova Manifestação',
        canActivate: [roleGuard],
        data: { roles: ['REMONSTRANT', 'ADMIN'] }
      },
      {
        path: 'manifestacoes/:id/recurso',
        loadComponent: () =>
          import('./pages/recurso/recurso').then(m => m.Recurso),
        title: 'Égide - Abrir recurso',
        canActivate: [roleGuard],
        data: { roles: ['REMONSTRANT', 'ADMIN'] }
      },
      {
        path: 'manifestacoes',
        loadComponent: () => import('./pages/report-list/report-list').then(m => m.ReportList),
        title: 'Égide - Manifestações',
        canActivate: [roleGuard],
        data: { roles: ['MANAGER', 'ADMIN'] }
      },
      {
        path: 'manifestacoes/:id/parecer-preliminar',
        loadComponent: () =>
          import('./pages/parecer-preliminar/parecer-preliminar').then(m => m.ParecerPreliminar),
        title: 'Égide - Parecer Preliminar',
        canActivate: [roleGuard],
        data: { roles: ['LISTENER', 'ADMIN'] }
      },
      {
        path: 'ouvidor/casos',
        loadComponent: () =>
          import('./pages/ouvidor-cases/ouvidor-cases').then(m => m.OuvidorCases),
        title: 'Égide - Meus casos atribuídos',
        canActivate: [roleGuard],
        data: { roles: ['LISTENER', 'ADMIN'] }
      },
      {
        path: 'recurso/casos',
        loadComponent: () =>
          import('./pages/recurso-cases/recurso-cases').then(m => m.RecursoCases),
        title: 'Égide - Recursos atribuídos',
        canActivate: [roleGuard],
        data: { roles: ['LISTENER', 'ADMIN'] }
      },
      {
        path: 'recurso/analise/:id',
        loadComponent: () =>
          import('./pages/analise-recurso/analise-recurso').then(m => m.AnaliseRecurso),
        title: 'Égide - Análise de recurso',
        canActivate: [roleGuard],
        data: { roles: ['LISTENER', 'ADMIN'] }
      },
      {
        path: 'manifestacoes/:id/responder',
        redirectTo: 'manifestacoes/:id/parecer-preliminar'
      },
      {
        path: 'ouvidor-geral/casos',
        loadComponent: () =>
          import('./pages/ouvidor-geral-cases/ouvidor-geral-cases').then(m => m.OuvidorGeralCases),
        title: 'Égide - Ouvidor Geral',
        canActivate: [roleGuard],
        data: { roles: ['GENERAL_LISTENER', 'ADMIN'] }
      },
      {
        path: 'manifestacoes/:id/defesa',
        loadComponent: () =>
          import('./pages/defense-review/defense-review').then(m => m.DefenseReview),
        title: 'Égide - Analisar Defesa'
      },
      {
        path: 'defesa/casos',
        loadComponent: () =>
          import('./pages/denounced-cases/denounced-cases').then(m => m.DenouncedCases),
        title: 'Égide - Casos contra mim'
      },
      {
        path: 'defesa/casos/:id',
        loadComponent: () =>
          import('./pages/denounced-case/denounced-case').then(m => m.DenouncedCase),
        title: 'Égide - Enviar Defesa'
      },
      {
        path: 'ouvidor-geral/casos/:id',
        loadComponent: () =>
          import('./pages/ouvidor-geral-validation/ouvidor-geral-validation')
            .then(m => m.OuvidorGeralValidation),
        title: 'Égide - Validar relatório',
        canActivate: [roleGuard],
        data: { roles: ['GENERAL_LISTENER', 'ADMIN'] }
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./pages/user-management/user-management').then(m => m.UserManagement),
        title: 'Égide - Usuários',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'notificacoes',
        loadComponent: () =>
          import('./pages/notifications/notifications').then(m => m.Notifications),
        title: 'Égide - Notificações'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
