/**
 * 📊 Statistiques des artisans vérifiés (badges actifs)
 */
export interface BadgeStats {

  /** Nombre total d’artisans ayant un badge actif */
  totalActiveBadges: number;

  /** Nombre d’artisans avec badge actif le mois précédent */
  previousMonthActive: number;

  /** Pourcentage d’évolution par rapport au mois précédent */
  evolutionPercent: number;

  /** Nombre d’artisans avec badge actif pour le mois en cours */
  currentMonthActive: number;
}


/**
 * 📊 Statistiques des avis publiés / modération
 */
export interface RatingStats {

  /** Nombre total d’avis */
  totalRatings: number;

  /** Avis en attente de validation */
  pending: number;

  /** Avis traités ou résolus */
  solved: number;

  /** Avis validés et publiés */
  ok: number;

  /** Avis masqués ou cachés */
  hidden: number;
}



export interface UsersGrowth {
  label: string;
  count: number;
}

/**
 * 📈 Évolution des revenus (badges)
 */
export interface RevenueEvolution {
  label: string; // Mois
  value: number; // Montant du revenu
}





/**
 * 📊 Top des métiers les plus demandés
 */
export interface TopTrade {
  tradeId: number;     // ID du métier
  tradeName: string;   // Nom du métier (label du graphique)
  userCount: number;   // Nombre d'utilisateurs / demandes
}



/**
 * 🍩 Répartition des utilisateurs par profil
 * Utilisé pour le graphique donut du tableau de bord
 */
export interface UserProfileDistribution {
  profile: 'ARTISAN' | 'CLIENT' ;
  percentage: number; // Pourcentage de représentation
  count: number;      // Nombre d'utilisateurs
}
