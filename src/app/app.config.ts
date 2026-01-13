import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http'; // 👈 IMPORT CORRECT
import { authInterceptor } from './core/interceptor/auth.interceptor';       // 👈 AJOUT

import { routes } from './app.routes';
import { refreshTokenInterceptor } from './core/interceptor/refresh-token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // 👇 TRES IMPORTANT : ENREGISTRER L’INTERCEPTOR
    provideHttpClient(
      withInterceptors([authInterceptor,refreshTokenInterceptor])
    )
  ]
};
