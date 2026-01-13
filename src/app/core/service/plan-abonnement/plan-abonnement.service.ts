import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { PlanAbonnement } from '../../../models/pages/plan-d\'abonnement/plan-abonnement';


// import { Page } from '../../../models/pages/gestion-metier/gestion-metier'; // ❌ pagination non utilisée

@Injectable({
  providedIn: 'root',
})
export class PlanAbonnementService {

  private baseUrl = environment.apiUrl;
  private endpoint = `${this.baseUrl}/api/badge-plan`;

  constructor(private http: HttpClient) {}

  /* ============================================================
   📌 LISTE AVEC PAGINATION (❌ DÉSACTIVÉE)
   ============================================================

   ⚠️ IMPORTANT :
   L’API "badge-plan" NE RENVOIE PAS de pagination.

   Réponse backend réelle :
   [
     { id, name, description, monthlyPrice, yearlyPrice, ... }
   ]

   ❌ Il n’y a PAS :
   - content
   - totalPages
   - totalElements

   👉 Cette méthode est conservée UNIQUEMENT
   👉 pour une future évolution backend.
  ============================================================ */

  /*
  getPlans(page = 0, size = 10): Observable<Page<PlanAbonnement>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<Page<PlanAbonnement>>(this.endpoint, { params });
  }
  */

  // ============================================================
  // ✅ LISTE SANS PAGINATION (UTILISÉE ACTUELLEMENT)
  // ============================================================
  getPlans(): Observable<PlanAbonnement[]> {
    return this.http.get<PlanAbonnement[]>(this.endpoint);
  }

  // ============================
  // 📄 DÉTAIL
  // ============================
  getPlanById(id: number): Observable<PlanAbonnement> {
    return this.http.get<PlanAbonnement>(`${this.endpoint}/${id}`);
  }

  // ============================
  // ➕ CRÉATION
  // ============================
  addPlan(payload: Partial<PlanAbonnement>): Observable<PlanAbonnement> {
    return this.http.post<PlanAbonnement>(this.endpoint, payload);
  }

  // ============================
  // ✏️ MODIFICATION
  // ============================
  updatePlan(
    id: number,
    payload: Partial<PlanAbonnement>
  ): Observable<PlanAbonnement> {
    return this.http.put<PlanAbonnement>(`${this.endpoint}/${id}`, payload);
  }

  // ============================
  // 🗑️ SUPPRESSION
  // ============================
  deletePlan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
