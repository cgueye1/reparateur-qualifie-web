// Autorité (roles)
export interface Authority {
  authority: string; // ADMIN | ARTISAN | CLIENT
}

// Métier lié à l'utilisateur (si ARTISAN)
export interface Trade {
  id: number;
  name: string;
  img: string;
  description: string;
}

// Utilisateur (sponsor = User simplifié → récursif léger)
export interface User {
  id: number;
  reference: string | null;

  lat: number;
  lon: number;

  nom: string;
  prenom: string;
  email: string;
  telephone: string;

  adress: string | null;
  description: string | null;
  photo: string | null;

  profil: 'ADMIN' | 'ARTISAN' | 'CLIENT';

  activated: boolean;
  validated: boolean;
  enabled: boolean;

  notifiable: boolean;
  online: boolean;

  trade: Trade | null;
  sponsor: User | null;

  averageRating: number;

  authorities: Authority[];

  username: string;

  // Sécurité (Spring Security)
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  accountNonLocked: boolean;
}


export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // page courante
}



/**
 * 📊 Répartition des utilisateurs par profil
 * Utilisé pour afficher les cartes statistiques
 * sur la page Utilisateurs (Admin / Artisan / Client)
 */
export interface UserProfileDistribution {

  // Profil utilisateur (ADMIN | ARTISAN | CLIENT)
  profile: 'ADMIN' | 'ARTISAN' | 'CLIENT';

  // Pourcentage du profil
  percentage: number;

  // Nombre total d'utilisateurs pour ce profil
  count: number;
}




/**
 * 📊 Statistiques globales des utilisateurs
 * Utilisé pour afficher les cartes :
 * - Total utilisateurs
 * - Utilisateurs actifs
 * - Évolution en pourcentage
 */
export interface UserStatsCounter {

  totalUsers: number;

  activeUsers: number;

  evolutionPercentage: number;
}


/**
 * � Utilisateur sponsorisé (artisan ajouté)
 * Utilisé pour l'onglet "Artisans ajoutés"
 */
export interface SponsoredUser {
  id: number;
  reference: string | null;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adress: string | null;
  lat: number;
  lon: number;
  profil: 'ADMIN' | 'ARTISAN' | 'CLIENT';
  sponsor: {
    id: number;
    nom: string;
    prenom: string;
  } | null;
  activeBadge: any | null;
  averageRating: number;
  ratingCount: number;
  sponsoredUsersCount: number;
  shareCount: number;
  photo: string | null;
}

/** * 🔗 Profil partagé
 * Utilisé pour l'onglet "Profils partagés"
 */
export interface SharedProfile {
  id: number;
  sharedBy: User;
  sharedUser: User;
  sharedAt: string;
}

/** * �📊 Réponse API pour la répartition des notes
 * L'API ne retourne que les notes de 2 à 5 étoiles
 */
export interface RatingDistributionResponse {
  totalRatings: number;
  percent2: number;
  percent3: number;
  percent4: number;
  percent5: number;
}

/**
 * 📊 Format transformé pour l'affichage
 * Utilisé pour afficher le graphique donut
 */
export interface RatingDistribution {
  score: number;
  percentage: number;
}
