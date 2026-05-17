import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.hasToken()) {
    return router.createUrlTree(['/login']);
  }

  if (authService.currentUser()) {
    return true;
  }

  return authService.restoreSession().pipe(
    map(user => (user ? true : router.createUrlTree(['/login']))),
    catchError(() => of(router.createUrlTree(['/login'])))
  );
};
