import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // 🔥 Récupération depuis localStorage OU sessionStorage
  const authLocal = localStorage.getItem('rq_auth');
  const authSession = sessionStorage.getItem('rq_auth');

  const authRaw = authLocal ?? authSession;
  let token = null;

  if (authRaw) {
    try {
      token = JSON.parse(authRaw).accessToken;
    } catch (e) {
      token = null;
    }
  }

  // Si un token existe → ajouter Authorization
  if (token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(authReq);
  }

  // Sinon → continuer sans header
  return next(req);
};
