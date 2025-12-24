import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environments';
import { UserStatsCounter } from '../../../../models/pages/utilisateurs/utilisateur';
import { BadgeStats, RatingStats, TopTrade, UserProfileDistribution } from '../../../../models/pages/tableau-de-bord/tableau-de-bord';
import { HttpParams } from '@angular/common/http';
import { UsersGrowth } from '../../../../models/pages/tableau-de-bord/tableau-de-bord';
import { RevenueEvolution } from '../../../../models/pages/tableau-de-bord/tableau-de-bord';



@Injectable({
  providedIn: 'root'
})
export class TableauDeBordService {




  private baseUrl = environment.apiUrl;

  // ============================
  // 🔹 ENDPOINTS DASHBOARD
  // ============================

  /** Artisans vérifiés (badges actifs) */
  private badgesStatsEndpoint =
    `${this.baseUrl}/api/badges/active-badges/stats`;

  /** Avis publiés / modération */
  private ratingsStatsEndpoint =
    `${this.baseUrl}/api/ratings/stats`;

  /** Statistiques globales des utilisateurs */
  private usersStatsEndpoint =
    `${this.baseUrl}/api/v1/user/stats-counter`;


    /** Évolution du nombre d’utilisateurs */
private usersGrowthEndpoint =
  `${this.baseUrl}/api/v1/user/users-growth`;

  /** Évolution des revenus */
private revenueEvolutionEndpoint =
  `${this.baseUrl}/api/badges/revenue-evolution`;

  /** Top des métiers les plus demandés */
private topTradesEndpoint = `${this.baseUrl}/api/trades/top`;

/** Répartition des utilisateurs par profil (donut) */
private usersProfilesDistributionEndpoint =
  `${this.baseUrl}/api/v1/user/distribution-users-profiles`;




  constructor(private http: HttpClient) {}

  // ============================
  // 📊 STATS ARTISANS VÉRIFIÉS
  // ============================
  getActiveBadgesStats(): Observable<BadgeStats> {
    return this.http.get<BadgeStats>(this.badgesStatsEndpoint);
  }

  // ============================
  // 📝 STATS AVIS PUBLIÉS
  // ============================
  getRatingsStats(): Observable<RatingStats> {
    return this.http.get<RatingStats>(this.ratingsStatsEndpoint);
  }

  // ============================
  // 👤 STATS UTILISATEURS
  // ============================
  /**
   * Récupère les statistiques globales
   * des utilisateurs (total, actifs, évolution).
   *
   * 👉 Utilisée UNIQUEMENT
   * pour les cartes du tableau de bord.
   */
  getUsersStats(): Observable<UserStatsCounter> {
    return this.http.get<UserStatsCounter>(
      this.usersStatsEndpoint
    );
  }


  // ============================
// 📈 ÉVOLUTION DES UTILISATEURS
// ============================
getUsersGrowth(type: 'ANNUEL' | 'HEBDO' | 'MENSUEL'): Observable<UsersGrowth[]> {

  // On ajoute le paramètre ?type=ANNUEL
  const params = new HttpParams().set('type', type);

  return this.http.get<UsersGrowth[]>(
    this.usersGrowthEndpoint,
    { params }
  );
}

// ============================
// 💰 ÉVOLUTION DES REVENUS
// ============================
getRevenueEvolution(): Observable<RevenueEvolution[]> {
  return this.http.get<RevenueEvolution[]>(
    this.revenueEvolutionEndpoint
  );
}

// ============================
// 📊 TOP DES MÉTIERS
// ============================
getTopTrades(): Observable<TopTrade[]> {
  return this.http.get<TopTrade[]>(this.topTradesEndpoint);
}


// ============================
// 🍩 RÉPARTITION UTILISATEURS PAR PROFIL
// ============================
getUsersProfilesDistribution(): Observable<UserProfileDistribution[]> {
  return this.http.get<UserProfileDistribution[]>(
    this.usersProfilesDistributionEndpoint
  );
}


}
