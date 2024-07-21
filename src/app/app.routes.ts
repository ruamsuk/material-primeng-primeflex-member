import { Routes } from '@angular/router';
import { LogInComponent } from './components/login/login.component';
import { authGuard, publicGuard } from './guards/auth.guard';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [authGuard],
    loadComponent: () => import('./components/home/home.component')
      .then(m => m.HomeComponent),
  },
  {
    path: 'auth',
    canActivate: [publicGuard],
    children: [
      {
        path: 'login',
        component: LogInComponent,
      },
      {
        path: 'forgot-pass',
        component: ForgotPasswordComponent,
      }
    ]
  },
  {
    path: 'member',
    canActivate: [authGuard],
    loadComponent: () => import('./components/member-list/member-list.component')
      .then(m => m.MemberListComponent),
  }
];
