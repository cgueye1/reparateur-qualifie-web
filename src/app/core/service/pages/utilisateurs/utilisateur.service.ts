import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environments';
import { Page, User, UserProfileDistribution, UserStatsCounter } from '../../../../models/pages/utilisateurs/utilisateur';


@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  private baseUrl = environment.apiUrl;
  private endpoint = `${this.baseUrl}/api/v1/user`;

  constructor(private http: HttpClient) {}

  // ============================
  // 📌 LISTE DES UTILISATEURS (PAGINÉE)
  // ============================
  getUsers(page = 0, size = 10): Observable<Page<User>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<Page<User>>(
      `${this.endpoint}/list-users`,
      { params }
    );
  }

 // ============================
  // 🔍 DÉTAIL D’UN UTILISATEUR
  // ============================
  /**
   * Récupère les informations complètes
   * d’un utilisateur par son ID.
   *
   * 👉 Utilisé dans :
   * - Détail Artisan
   * - Détail Client
   */
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.endpoint}/${id}`);
  }

  // ============================
  // 🔁 ACTIVER / DÉSACTIVER UN UTILISATEUR
  // ============================
  toggleActivation(id: number): Observable<void> {
    return this.http.put<void>(
      `${this.endpoint}/activate-or-desactivate/${id}`,
      {}
    );
  }

  // ============================
  // 📊 RÉPARTITION DES UTILISATEURS PAR PROFIL
  // ============================
  /**
   * Cette API permet de récupérer la répartition
   * des utilisateurs par profil (ADMIN / ARTISAN / CLIENT).
   *
   * 👉 Elle sera utilisée pour afficher
   * les cartes statistiques sur la page Utilisateurs.
   */
  getUsersProfilesDistribution(): Observable<UserProfileDistribution[]> {
    return this.http.get<UserProfileDistribution[]>(
      `${this.endpoint}/distribution-users-profiles`
    );
  }



  // ============================
// 📊 STATISTIQUES GLOBALES UTILISATEURS
// ============================
/**
 * Cette API permet de récupérer les statistiques globales
 * des utilisateurs (total, actifs, évolution).
 *
 * 👉 Utilisée pour les cartes statistiques
 * de la page Utilisateurs.
 */
getUsersStatsCounter(): Observable<UserStatsCounter> {
  return this.http.get<UserStatsCounter>(
    `${this.endpoint}/stats-counter`
  );
}

}
