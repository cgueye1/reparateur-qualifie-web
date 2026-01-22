import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environments';
import { Rating, RatingStats, RatingStatusUpdateRequest, Page } from '../../../../models/pages/moderation-avis/moderation-avis';

@Injectable({
    providedIn: 'root'
})
export class ModerationAvisService {

    private baseUrl = environment.apiUrl;
    private endpoint = `${this.baseUrl}/api/ratings`;

    constructor(private http: HttpClient) { }

    /* ============================================================
     * 📊 RÉCUPÉRER LES STATISTIQUES DES AVIS
     * ============================================================
     */
    getRatingStats(): Observable<RatingStats> {
        return this.http.get<RatingStats>(`${this.endpoint}/stats`);
    }

    /* ============================================================
     * 📌 LISTE DES AVIS (PAGINÉE)
     * ⚠️ ENDPOINT NON DISPONIBLE DANS L'API ACTUELLE
     * ============================================================
     * L'API ne fournit pas d'endpoint pour lister TOUS les avis.
     * Endpoints disponibles uniquement par userId:
     * - GET /api/ratings/received/{userId}
     * - GET /api/ratings/given-by-user/{userId}
     * 
     * TODO: Demander au backend d'ajouter:
     * GET /api/ratings?status={status}&page={page}&size={size}
     */
    // getRatings(
    //   status?: string,
    //   page: number = 0,
    //   size: number = 10
    // ): Observable<Page<Rating>> {

    //   let params = new HttpParams()
    //     .set('page', page.toString())
    //     .set('size', size.toString());

    //   // Filtre par statut si fourni
    //   if (status) {
    //     params = params.set('status', status);
    //   }

    //   return this.http.get<Page<Rating>>(this.endpoint, { params });
    // }

    /* ============================================================
     * ✏️ METTRE À JOUR LE STATUT D'UN AVIS (MODÉRATION)
     * ============================================================
     * @param ratingId  ID de l'avis
     * @param request   Nouveau statut + raison optionnelle
     */
    updateRatingStatus(
        ratingId: number,
        request: RatingStatusUpdateRequest
    ): Observable<Rating> {
        return this.http.patch<Rating>(
            `${this.endpoint}/${ratingId}/status`,
            request
        );
    }

    /* ============================================================
     * 📄 RÉCUPÉRER UN AVIS PAR ID
     * ⚠️ ENDPOINT NON DISPONIBLE DANS L'API ACTUELLE
     * ============================================================
     * L'API ne fournit pas d'endpoint pour récupérer un avis par ID
     */
    // getRatingById(ratingId: number): Observable<Rating> {
    //   return this.http.get<Rating>(`${this.endpoint}/${ratingId}`);
    // }
}
