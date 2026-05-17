export function landingRouteFor(role: string | null | undefined): string {
  switch ((role || '').toUpperCase()) {
    case 'REMONSTRANT':
      return '/minhas-manifestacoes';
    case 'LISTENER':
    case 'GENERAL_LISTENER':
    case 'MANAGER':
    case 'ADMIN':
      return '/dashboard';
    default:
      return '/login';
  }
}
