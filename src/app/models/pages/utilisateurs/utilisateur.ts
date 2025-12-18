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
