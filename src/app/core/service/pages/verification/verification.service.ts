import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, forkJoin } from 'rxjs';

import { environment } from '../../../../../environments/environments';
import { Verification, UserDocument } from '../../../../models/pages/verification/verification';
import { Page } from '../../../../models/pages/utilisateurs/utilisateur';


@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  private baseUrl = environment.apiUrl;
  private endpoint = `${this.baseUrl}/api/badges`;

  constructor(private http: HttpClient) { }

  /* ============================================================
   * 📌 LISTE DES VÉRIFICATIONS (PAGINÉE)
   * ============================================================
   * @param status  PENDING | VALIDATED | REJECTED (optionnel)
   * @param page    numéro de page (0-based)
   * @param size    nombre d’éléments par page
   */
  getVerifications(
    status?: 'PENDING' | 'VALIDATED' | 'REJECTED',
    page: number = 0,
    size: number = 10
  ): Observable<Page<Verification>> {

    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    // 🔎 Filtre par statut si fourni
    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<Page<Verification>>(this.endpoint, { params });
  }

  /* ============================================================
   * ✅ CHANGER LE STATUT D'UNE VÉRIFICATION
   * ============================================================
   * @param badgeId  ID du badge
   * @param active   true = Valider | false = Rejeter
   */
  updateBadgeStatus(badgeId: number, active: boolean): Observable<void> {
    const params = new HttpParams().set('active', active);
    return this.http.put<void>(`${this.endpoint}/${badgeId}/status`, {}, { params });
  }

  /* ============================================================
   * 📌 RÉCUPÉRER UNE VÉRIFICATION PAR ID
   * ============================================================
   * @param id  ID de la vérification (badge)
   */
  getVerificationById(id: number): Observable<Verification | undefined> {
    // On charge la liste complète et on filtre par ID
    // (pas d'endpoint GET /api/badges/{id} dans le backend)
    return this.http.get<Page<Verification>>(this.endpoint, {
      params: new HttpParams().set('page', 0).set('size', 1000)
    }).pipe(
      map(page => page.content.find(v => v.id === id))
    );
  }

  /* ============================================================
   * 📄 RÉCUPÉRER LES DOCUMENTS D'UN UTILISATEUR (PARTIE 2)
   * ============================================================
   * @param userId  ID de l'utilisateur
   */
  getUserDocuments(userId: number): Observable<UserDocument[]> {
    return this.http.get<UserDocument[]>(`${this.baseUrl}/api/user/documents/${userId}`);
  }

  /* ============================================================
   * 📊 RÉCUPÉRER LES STATISTIQUES DES BADGES
   * ============================================================
   * Compte le nombre de badges pour chaque statut
   */
  getBadgeStats(): Observable<{ total: number; pending: number; validated: number; rejected: number }> {
    // Faire 4 appels en parallèle pour compter chaque statut
    const total$ = this.http.get<Page<Verification>>(this.endpoint, {
      params: new HttpParams().set('page', 0).set('size', 1)
    });

    const pending$ = this.http.get<Page<Verification>>(this.endpoint, {
      params: new HttpParams().set('page', 0).set('size', 1).set('status', 'PENDING')
    });

    const validated$ = this.http.get<Page<Verification>>(this.endpoint, {
      params: new HttpParams().set('page', 0).set('size', 1).set('status', 'VALIDATED')
    });

    const rejected$ = this.http.get<Page<Verification>>(this.endpoint, {
      params: new HttpParams().set('page', 0).set('size', 1).set('status', 'REFUSED')
    });

    return forkJoin([total$, pending$, validated$, rejected$]).pipe(
      map(([total, pending, validated, rejected]) => ({
        total: total.totalElements,
        pending: pending.totalElements,
        validated: validated.totalElements,
        rejected: rejected.totalElements
      }))
    );
  }

}
