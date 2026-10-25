import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.LoginComponent)
  },
  {
    path: 'employees',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/employees/employee-list/employee-list')
        .then(m => m.EmployeeListComponent)
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./app')
        .then(m => m.HomeComponent)
  },
  {
    path: '**',
    redirectTo: 'employees'
  }
];