import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuardGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  // 🔥 Récupération du token : localStorage OU sessionStorage
  const authLocal = localStorage.getItem("rq_auth");
  const authSession = sessionStorage.getItem("rq_auth");

  const authRaw = authLocal ?? authSession;

  // 🟦 1. Laisser passer la page de connexion
  if (state.url.includes('/auth/login')) {
    return true;
  }

  // 🟥 2. Si pas connecté → redirection
  if (!authRaw) {
    return router.createUrlTree(['/auth/login']);
  }

  try {
    const auth = JSON.parse(authRaw);

    // 🟩 3. Si token valide → accès autorisé
    if (auth && auth.accessToken) {
      return true;
    }

  } catch {
    // JSON corrompu → retour login
    return router.createUrlTree(['/auth/login']);
  }

  // fallback sécurité
  return router.createUrlTree(['/auth/login']);
};
