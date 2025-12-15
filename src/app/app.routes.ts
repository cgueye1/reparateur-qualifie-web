import { Routes } from '@angular/router';
import { authGuardGuard } from './core/guard/auth-guard.guard';

export const routes: Routes = [
  // 🛡 ZONE PROTÉGÉE
  {
    path: '',
    canActivate: [authGuardGuard],
    loadComponent: () =>
      import('./layout/main-layout/main-layout/main-layout.component')
        .then((m) => m.MainLayoutComponent),

    children: [
      // Redirect
      { path: '', redirectTo: 'tableau-de-bord', pathMatch: 'full' },

      // Tableau de bord
      {
        path: 'tableau-de-bord',
        loadComponent: () =>
          import('./pages/tableau-de-bord/tableau-de-bord/tableau-de-bord.component')
            .then((m) => m.TableauDeBordComponent),
        data: { title: 'Tableau de bord' },
      },

      // 🟦 VÉRIFICATIONS
      {
        path: 'verification',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/verification/verification/verification.component')
                .then((m) => m.VerificationComponent),
            data: { title: 'Vérifications' },
          },
          {
            path: 'detail',
            loadComponent: () =>
              import('./pages/verification/detail-verification/detail-verification.component')
                .then((m) => m.DetailVerificationComponent),
            data: { title: 'Détail vérification' },
          }
        ]
      },

      // 🟧 UTILISATEURS
      {
        path: 'utilisateurs',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/utilisateur/utilisateur/utilisateur.component')
                .then((m) => m.UtilisateurComponent),
            data: { title: 'Utilisateurs' },
          },
          {
            path: 'detail',
            loadComponent: () =>
              import('./pages/utilisateur/detail/detail.component')
                .then((m) => m.DetailComponent),
            data: { title: 'Détails utilisateur' },
          },
          {
            path: 'detail-client',
            loadComponent: () =>
              import('./pages/utilisateur/detail-client/detail-client.component')
                .then((m) => m.DetailClientComponent),
            data: { title: 'Détails client' },
          }
        ]
      },

      // 🟩 PLANS D’ABONNEMENT
      {
        path: 'plans-abonnement',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/plan-abonnement/plan-abonnement/plan-abonnement.component')
                .then((m) => m.PlanAbonnementComponent),
            data: { title: 'Plans d’abonnement' },
          },
          {
            path: 'detail',
            loadComponent: () =>
              import('./pages/plan-abonnement/detail/detail/detail.component')
                .then((m) => m.DetailComponent),
            data: { title: 'Détail abonnement' },
          }
        ]
      },

      // Mon compte
      {
        path: 'mon-compte',
        loadComponent: () =>
          import('./pages/mom-compte/mon-compte/mon-compte.component')
            .then((m) => m.MonCompteComponent),
        data: { title: 'Mon compte' },
      },

      // Gestion des métiers
      {
        path: 'gestion-metiers',
        loadComponent: () =>
          import('./pages/gestion-metiers/gestion-metiers/gestion-metiers.component')
            .then((m) => m.GestionMetiersComponent),
        data: { title: 'Gestion des métiers' },
      },

      // Modération des avis
      {
        path: 'moderation-avis',
        loadComponent: () =>
          import('./pages/moderation-avis/moderation-avis/moderation-avis.component')
            .then((m) => m.ModerationAvisComponent),
        data: { title: 'Modération des avis' },
      },


      // Publicités
      {
        path: 'publicites',
        loadComponent: () =>
          import('./pages/publicite/publicite/publicite.component')
            .then((m) => m.PubliciteComponent),
        data: { title: 'Publicités' },
      },
    ],
  },

  // 🚪 Routes publiques
{
  path: 'auth',
  children: [
    {
      path: 'login',
      loadComponent: () =>
        import('./auth/login/login/login.component')
          .then((m) => m.LoginComponent),
    },
    {
      path: 'change-password',
      loadComponent: () =>
        import('./auth/password-change/password-change.component')
          .then((m) => m.PasswordChangeComponent),
    },
    {
      path: 'password-reset',
      loadComponent: () =>
        import('./auth/password-reset/password-reset/password-reset.component')
          .then((m) => m.PasswordResetComponent),
    }
  ]
}

];
