import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/layout/main-layout.component';
import { LoginComponent } from './components/auth/login.component';
// import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => 
          import('./components/dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => 
          import('./components/user-management/user-list.component')
            .then(m => m.UserListComponent)
      },
      {
        path: 'follow-ups',
        loadComponent: () => 
          import('./features/follow-ups/follow-up-list.component')
            .then(m => m.FollowUpListComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  // {
  //   path: 'auth',
  //   loadChildren: () => import('./components/auth/auth.routes').then(m => m.AUTH_ROUTES)
  // }
];
