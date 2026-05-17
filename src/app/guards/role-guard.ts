import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { landingRouteFor } from '../services/auth/role-routes';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = (route.data?.['roles'] as string[] | undefined) ?? [];
  if (requiredRoles.length === 0) {
    return true;
  }

  const currentRole = authService.currentUser()?.role?.toUpperCase() ?? null;
  if (currentRole && requiredRoles.map(r => r.toUpperCase()).includes(currentRole)) {
    return true;
  }

  return router.createUrlTree([landingRouteFor(currentRole)]);
};

export const landingGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const role = authService.currentUser()?.role ?? null;
  return router.createUrlTree([landingRouteFor(role)]);
};
