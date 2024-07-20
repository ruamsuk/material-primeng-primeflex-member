import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const routerInjection =  () => inject(Router);
export const authStateObs$ = () => inject(AuthService).authState$;

export const authGuard: CanActivateFn = () => {
  const router = routerInjection();

  return authStateObs$().pipe(
    map((user) => {
      if (!user) {
        router.navigateByUrl('auth/login');
        return false;
      }
      return true;
    })
  );
};

export const publicGuard: CanActivateFn = () => {
  const router = routerInjection();

  return authStateObs$().pipe(
    map((user) => {
      if (user) {
        router.navigateByUrl('/');
        return false;
      }
      return true;
    })
  );
};
