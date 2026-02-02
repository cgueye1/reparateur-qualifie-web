import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environments';
import { Page, User, UserProfileDistribution, UserStatsCounter, RatingDistribution, RatingDistributionResponse, SponsoredUser, SharedProfile, Document, ReceivedRating } from '../../../../models/pages/utilisateurs/utilisateur';


@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  private baseUrl = environment.apiUrl;
  private endpoint = `${this.baseUrl}/api/v1/user`;

  constructor(private http: HttpClient) { }

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

  // ============================
  // 📊 RÉPARTITION DES NOTES PAR SCORE
  // ============================
  /**
   * Cette API permet de récupérer la répartition
   * des notes d'un utilisateur par score (1 à 5 étoiles).
   *
   * 👉 Utilisée pour afficher le graphique donut
   * dans la page détail utilisateur.
   */
  getRatingDistribution(userId: number): Observable<RatingDistributionResponse> {
    return this.http.get<RatingDistributionResponse>(
      `${this.baseUrl}/api/ratings/user/${userId}/repartition-by-score`
    );
  }

  // ============================
  // 📊 VUES MENSUELLES DU PROFIL
  // ============================
  /**
   * Cette API permet de récupérer les vues mensuelles
   * du profil d'un utilisateur pour une année donnée.
   *
   * 👉 Utilisée pour afficher le graphique "Vues du profil"
   * dans la page détail utilisateur.
   *
   * @param userId - ID de l'utilisateur
   * @param year - Année (ex: 2026)
   * @returns Un objet avec les clés "1" à "12" (mois) et les valeurs = nombre de vues
   */
  getMonthlyProfileViews(userId: number, year: number): Observable<{ [key: string]: number }> {
    const params = new HttpParams().set('year', year.toString());
    return this.http.get<{ [key: string]: number }>(
      `${this.endpoint}/profile-views/${userId}/monthly`,
      { params }
    );
  }

  // ============================
  // 👥 UTILISATEURS SPONSORISÉS (ARTISANS AJOUTÉS)
  // ============================
  /**
   * Cette API permet de récupérer la liste paginée
   * des utilisateurs sponsorisés par un sponsor donné.
   *
   * 👉 Utilisée pour l'onglet "Artisans ajoutés"
   * dans la page détail client.
   *
   * @param sponsorId - ID du sponsor
   * @param page - Numéro de page (défaut: 0)
   * @param size - Taille de page (défaut: 10)
   */
  getSponsoredUsers(sponsorId: number, page = 0, size = 10): Observable<Page<SponsoredUser>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<Page<SponsoredUser>>(
      `${this.endpoint}/${sponsorId}/sponsored`,
      { params }
    );
  }

  // ============================
  // 🔗 PROFILS PARTAGÉS
  // ============================
  /**
   * Cette API permet de récupérer la liste paginée
   * des profils partagés par un utilisateur.
   *
   * 👉 Utilisée pour l'onglet "Profils partagés"
   * dans la page détail client.
   *
   * @param userId - ID de l'utilisateur
   * @param page - Numéro de page (défaut: 0)
   * @param size - Taille de page (défaut: 10)
   */
  getSharedProfiles(userId: number, page = 0, size = 10): Observable<Page<SharedProfile>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<Page<SharedProfile>>(
      `${this.endpoint}/user-share/${userId}`,
      { params }
    );
  }

  // ============================
  // 📄 DOCUMENTS UTILISATEUR
  // ============================
  /**
   * Cette API permet de récupérer la liste des documents
   * d'un utilisateur (artisan).
   *
   * 👉 Utilisée pour l'onglet "Documents"
   * dans la page détail utilisateur.
   *
   * @param userId - ID de l'utilisateur
   */
  getUserDocuments(userId: number): Observable<Document[]> {
    return this.http.get<Document[]>(
      `${this.baseUrl}/api/user/documents/${userId}`
    );
  }

  /**
   * Ouvre un document utilisateur dans un nouvel onglet.
   * Construit l'URL complète à partir du nom du fichier.
   * Fonctionne pour tous types de fichiers (PDF, images, etc.)
   *
   * @param fileUrl - Nom du fichier (ex: "c675deea-2ddd-4344-918f-918f1d30621b.png" ou "document.pdf")
   */
  downloadDocument(fileUrl: string): void {
    const fileBaseUrl = environment.imageUrl;
    const fullUrl = `${fileBaseUrl}/${fileUrl}`;
    window.open(fullUrl, '_blank');
  }

  // ============================
  // ⭐ ÉVALUATIONS REÇUES
  // ============================
  /**
   * Cette API permet de récupérer la liste paginnée
   * des évaluations reçues par un utilisateur.
   *
   * 👉 Utilisée pour l'onglet "Évaluations"
   * dans la page détail utilisateur.
   *
   * @param userId - ID de l'utilisateur
   * @param page - Numéro de page (défaut: 0)
   * @param size - Taille de page (défaut: 10)
   */
  getReceivedRatings(userId: number, page = 0, size = 10): Observable<Page<ReceivedRating>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<Page<ReceivedRating>>(
      `${this.baseUrl}/api/ratings/received/${userId}`,
      { params }
    );
  }

  // ============================
  // 🔍 RECHERCHE D'ARTISANS
  // ============================
  /**
   * Recherche des artisans avec pagination
   * 
   * 👉 Utilisée pour afficher les artisans
   * dans la section "Nos artisans" du portail.
   * 
   * @param page - Numéro de page (défaut: 0)
   * @param size - Taille de page (défaut: 10)
   * @returns Page paginée d'artisans
   */
  searchArtisans(page = 0, size = 10): Observable<Page<User>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<Page<User>>(
      `${this.endpoint}/search/artisan`,
      { params }
    );
  }

}
