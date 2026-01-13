import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { RefreshTokenService } from '../service/auth/refresh-token/refresh-token.service';

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {

  const refreshService = inject(RefreshTokenService);
  const router = inject(Router);

  return next(req).pipe(

    catchError((error: HttpErrorResponse) => {

      // 👉 L’API répond : "Token expiré"
      if (error.status === 401) {

        // ✔ Récupérer le refresh token dans localStorage ou sessionStorage
        const authLocal = localStorage.getItem("rq_auth");
        const authSession = sessionStorage.getItem("rq_auth");

        const authRaw = authLocal ?? authSession;

        if (!authRaw) {
          router.navigate(['/auth/login']);
          return throwError(() => error);
        }

        const refreshToken = JSON.parse(authRaw).refreshToken;

        // 🔥 Appeler l’API pour obtenir un NOUVEAU token
        return refreshService.refreshToken(refreshToken).pipe(

          switchMap((res: any) => {

            // ✔ Stocker les nouveaux tokens
            const newAuthData = {
              accessToken: res.token,
              refreshToken: res.refreshToken
            };

            if (authLocal) {
              localStorage.setItem("rq_auth", JSON.stringify(newAuthData));
            } else {
              sessionStorage.setItem("rq_auth", JSON.stringify(newAuthData));
            }

            // 🔁 Rejouer la requête échouée AVEC le nouveau token
            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.token}`
              }
            });

            return next(newReq);
          }),

          // ❌ Si même le refresh token ne marche plus → déconnexion
          catchError((refreshErr) => {
            localStorage.removeItem("rq_auth");
            sessionStorage.removeItem("rq_auth");
            router.navigate(['/auth/login']);
            return throwError(() => refreshErr);
          })
        );
      }

      // Pour toute autre erreur
      return throwError(() => error);
    })
  );
};
