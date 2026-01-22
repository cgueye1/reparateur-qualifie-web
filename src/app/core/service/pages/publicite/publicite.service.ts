import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environments';
import { Publicite, PubliciteStats, Page } from '../../../../models/pages/publicite/publicite';


@Injectable({
  providedIn: 'root'
})
export class PubliciteService {

  private baseUrl = environment.apiUrl;
  private endpoint = `${this.baseUrl}/api/ads`;

  constructor(private http: HttpClient) { }

  /* ============================================================
   * 📌 LISTE DES PUBLICITÉS
   * ============================================================
   */
  getAds(page = 0, size = 10): Observable<Page<Publicite>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<Publicite>>(`${this.endpoint}/search`, { params });
  }

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
