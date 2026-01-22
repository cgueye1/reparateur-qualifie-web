import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environments';
import { PlanAbonnement, PlanStats } from '../../../models/pages/plan-d\'abonnement/plan-abonnement';


// import { Page } from '../../../models/pages/gestion-metier/gestion-metier'; // ❌ pagination non utilisée

@Injectable({
  providedIn: 'root',
})
export class PlanAbonnementService {

  private baseUrl = environment.apiUrl;
  private endpoint = `${this.baseUrl}/api/badge-plan`;

  constructor(private http: HttpClient) { }

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

  // ============================================================
  // 📊 RÉCUPÉRER LES STATISTIQUES DES PLANS
  // ============================================================
  getPlanStats(): Observable<PlanStats> {
    /* ⚠️ LIMITATION BACKEND :
     * Les BadgePlan n'ont pas de champ "status" ou "active"
     * Impossible de distinguer les plans actifs/inactifs
     * Seul le nombre d'abonnés (subscribers) est fiable
     */

    // ❌ COMMENTÉ : Compte total des plans (pas de distinction actif/inactif possible)
    // const allPlans$ = this.getPlans();

    // ❌ COMMENTÉ : activeStats.activeBadgesCount = nombre de BADGES actifs, pas de PLANS
    // const activeStats$ = this.http.get<any>(`${this.baseUrl}/api/badges/active-badges/stats`);

    // ✅ FONCTIONNE : Nombre total d'abonnés (badges validés)
    const subscribers$ = this.http.get<any>(`${this.baseUrl}/api/badges`, {
      params: new HttpParams().set('status', 'VALIDATED').set('page', 0).set('size', 1)
    });

    return subscribers$.pipe(
      map((subscribersPage) => {
        return {
          totalPlans: 0,           // ⚠️ Non implémenté
          activePlans: 0,          // ⚠️ Non implémenté
          inactivePlans: 0,        // ⚠️ Non implémenté
          subscribers: subscribersPage.totalElements || 0  // ✅ Fonctionnel
        };
      })
    );
  }

  // ============================================================
  // 👥 RÉCUPÉRER LES ABONNÉS D'UN PLAN
  // ============================================================
  getPlanSubscribers(badgePlanId: number, page: number = 0, size: number = 100): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('status', 'VALIDATED'); // Seulement les badges validés

    // On récupère tous les badges et on filtrera côté frontend si badgePlanId n'est pas supporté
    return this.http.get<any>(`${this.baseUrl}/api/badges`, { params });
  }
}
