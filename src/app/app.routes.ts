import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    // Layout principale
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    // Pages enfants
    children: [
      {
        path: '',
        redirectTo: 'tableau-de-bord',
        pathMatch: 'full',
      },

       // Tableau de bord

      {
        path: 'tableau-de-bord',
        loadComponent: () =>
          import(
            './pages/tableau-de-bord/tableau-de-bord/tableau-de-bord.component'
          ).then((m) => m.TableauDeBordComponent),
        data: { title: 'Tableau de bord' },
      },


       // Vérifications

      {
        path: 'verification',
        loadComponent: () =>
          import(
            './pages/verification/verification/verification.component'
          ).then((m) => m.VerificationComponent),
        data: { title: 'Vérifications' },
      },


       {
        path: 'detail-verification',
        loadComponent: () =>
          import(
            './pages/verification/detail-verification/detail-verification.component'
          ).then((m) => m.DetailVerificationComponent),
        data: { title: ' Détails Vérifications' },
      },

      // Modération des avis

      {
        path: 'moderation-avis',
        loadComponent: () =>
          import(
            './pages/moderation-avis/moderation-avis/moderation-avis.component'
          ).then((m) => m.ModerationAvisComponent),
        data: { title: 'Modération des avis' },
      },


      // Publicités

      {
        path: 'publicites',
        loadComponent: () =>
          import(
            './pages/publicite/publicite/publicite.component'
          ).then((m) => m.PubliciteComponent),
        data: { title: 'Publicités' },
      },


       // Utilisateurs

{
  path: 'utilisateurs',
  loadComponent: () =>
    import('./pages/utilisateur/utilisateur/utilisateur.component')
      .then((m) => m.UtilisateurComponent),
  data: { title: 'Utilisateurs' },
},

{
  path: 'details',
  loadComponent: () =>
    import('./pages/utilisateur/detail/detail.component')
      .then((m) => m.DetailComponent),
  data: { title: 'Détails utilisateur' },
},


{
  path: 'details-client',
  loadComponent: () =>
    import('./pages/utilisateur/detail-client/detail-client.component')
      .then((m) => m.DetailClientComponent),
  data: { title: 'Détails Client' },
},

      // Plans d’abonnement
      {
        path: 'plans-abonnement',
        loadComponent: () =>
          import(
            './pages/plan-abonnement/plan-abonnement/plan-abonnement.component'
          ).then((m) => m.PlanAbonnementComponent),
        data: { title: 'Plans d’abonnement' },
      },


      {
        path: 'details-abonnements',
        loadComponent: () =>
          import(
            './pages/plan-abonnement/detail/detail/detail.component'
          ).then((m) => m.DetailComponent),
        data: { title: 'Détails abonnement' },
      },


       // Mon compte
      {
        path: 'mon-compte',
        loadComponent: () =>
          import(
            './pages/mom-compte/mon-compte/mon-compte.component'
          ).then((m) => m.MonCompteComponent),
        data: { title: 'Mon compte' },
      },
    ]
  },




   {
  path: 'auth',
  children: [
    {
      path: 'login',
      loadComponent: () =>
        import('./auth/login/login/login.component')
          .then((m) => m.LoginComponent),
    },


  ],
}

];
