import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environments';
import { Publicite, PubliciteStats } from '../../../../models/pages/publicite/publicite';


@Injectable({
  providedIn: 'root'
})
export class PubliciteService {

  private baseUrl = environment.apiUrl;
  private endpoint = `${this.baseUrl}/api/ads`;

  constructor(private http: HttpClient) { }

  /* ============================================================
   * 📌 LISTE DES PUBLICITÉS
   * ❌ API NON DISPONIBLE POUR LE MOMENT
   * ============================================================
   *
   * Le backend ne fournit pas encore l’endpoint permettant
   * de récupérer toutes les publicités (GET /api/ads).
   *
   * Cette méthode sera implémentée dès que l’API sera disponible.
   */
  // getAds(page = 0, size = 10): Observable<Page<Publicite>> {
  //   return this.http.get<Page<Publicite>>(this.endpoint);
  // }

  /* ============================================================
   * ➕ CRÉATION D’UNE PUBLICITÉ
   * ============================================================ */
  addAd(payload: FormData): Observable<Publicite> {
    return this.http.post<Publicite>(`${this.endpoint}/save`, payload);
  }

  /* ============================================================
   * ✏️ MODIFICATION D’UNE PUBLICITÉ
   * ============================================================ */
  updateAd(id: number, payload: FormData): Observable<Publicite> {
    return this.http.put<Publicite>(`${this.endpoint}/${id}`, payload);
  }

  /* ============================================================
   * 🗑️ SUPPRESSION D’UNE PUBLICITÉ
   * ============================================================ */
  deleteAd(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

  getAdsStats(): Observable<PubliciteStats> {
    return this.http.get<PubliciteStats>(`${this.endpoint}/stats`);
  }
}
