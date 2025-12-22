import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environments';
import { Verification } from '../../../../models/pages/verification/verification';
import { Page } from '../../../../models/pages/utilisateurs/utilisateur';


@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  private baseUrl = environment.apiUrl;
  private endpoint = `${this.baseUrl}/api/badges`;

  constructor(private http: HttpClient) {}

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

}
