import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PlanAbonnementService } from '../../../core/service/plan-abonnement/plan-abonnement.service';
import { SwettAlerteService } from '../../../core/service/alerte/swett-alerte.service';
import { PlanAbonnement, PlanStats } from '../../../models/pages/plan-d\'abonnement/plan-abonnement';

@Component({
  selector: 'app-plan-abonnement',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule, RouterModule, FormsModule],
  templateUrl: './plan-abonnement.component.html',
  styleUrl: './plan-abonnement.component.css'
})
export class PlanAbonnementComponent implements OnInit {

  /* ============================================================
   📌 PAGINATION (❌ DÉSACTIVÉE)
   ============================================================

   ⚠️ IMPORTANT :
   L’API "plan abonnement" NE RENVOIE PAS de pagination.

   Réponse backend réelle :
   [
     { id, name, description, monthlyPrice, yearlyPrice, ... }
   ]

   ❌ Il n’y a PAS :
   - res.content
   - res.totalPages
   - res.totalElements

   👉 La pagination sera ajoutée PLUS TARD
   👉 quand le backend la supportera.
  ============================================================ */

  // page = 0;
  // size = 10;
  // totalPages = 0;
  // totalElements = 0;

  // ================================
  // 📌 DONNÉES
  // ================================
  plans: PlanAbonnement[] = [];
  searchTerm = '';
  loading = false;

  // ================================
  // ❌ STATISTIQUES (COMMENTÉES)
  // ================================
  // stats: PlanStats = {
  //   totalPlans: 0,
  //   activePlans: 0,
  //   inactivePlans: 0,
  //   subscribers: 0
  // };
  // loadingStats = false;

  constructor(
    private planService: PlanAbonnementService,
    private alertService: SwettAlerteService
  ) { }

  ngOnInit(): void {
    this.loadPlans();
    // this.loadPlanStats();
  }

  // ================================
  // 📌 LISTE DES PLANS
  // ================================
  loadPlans() {
    this.loading = true;

    this.planService.getPlans().subscribe({
      next: (res: PlanAbonnement[]) => {

        this.plans = res;

        console.log('Plans chargés avec succès ✅', res);

        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement plans ❌', err);
        this.loading = false;

        // 🔔 Alerte utilisateur
        this.alertService.error(
          "Erreur lors du chargement des plans d’abonnement",
          'light'
        );
      }
    });
  }

  // ================================
  // ❌ CHARGER LES STATISTIQUES (COMMENTÉ)
  // ================================
  // loadPlanStats() {
  //   this.loadingStats = true;

  //   this.planService.getPlanStats().subscribe({
  //     next: (stats: PlanStats) => {
  //       this.stats = stats;
  //       console.log('Stats reçues ✅', stats);
  //       this.loadingStats = false;
  //     },
  //     error: (err) => {
  //       console.error('Erreur chargement stats ❌', err);
  //       this.loadingStats = false;
  //       // Garder les valeurs à 0 en cas d'erreur
  //     }
  //   });
  // }

  // ================================
  // �🔍 FILTRAGE RECHERCHE
  // ================================
  get filteredPlans(): PlanAbonnement[] {
    return (this.plans || []).filter(plan =>
      plan.name?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // ================================
  // 🗑️ SUPPRESSION
  // ================================
  showDeletePopup = false;
  selectedPlan: PlanAbonnement | null = null;

  openDeletePopup(plan: PlanAbonnement) {
    this.selectedPlan = plan;
    this.showDeletePopup = true;
  }

  closeDelete() {
    this.showDeletePopup = false;
    this.selectedPlan = null;
  }

  confirmDelete() {
    if (!this.selectedPlan) return;

    this.planService.deletePlan(this.selectedPlan.id).subscribe({
      next: () => {
        this.alertService.success(
          'Plan supprimé avec succès',
          'light'
        );

        this.loadPlans();
        this.closeDelete();
      },
      error: () => {
        this.alertService.error(
          "Une erreur s'est produite lors de la suppression du plan",
          'light'
        );
      }
    });
  }

  // ================================
  // ➕ CRÉATION
  // ================================
  showCreatePopup = false;

  newPlan = {
    name: '',
    description: '',
    monthlyPrice: 0,
    yearlyDiscount: 0
  };

  openCreatePopup() {
    this.showCreatePopup = true;
  }

  closeCreatePopup() {
    this.showCreatePopup = false;
  }

  saveNewPlan() {
    this.planService.addPlan(this.newPlan).subscribe({
      next: () => {
        this.alertService.success(
          'Plan créé avec succès',
          'light'
        );

        this.closeCreatePopup();
        this.loadPlans();
      },
      error: () => {
        this.alertService.error(
          "Une erreur s'est produite lors de la création du plan",
          'light'
        );
      }
    });
  }

  // ================================
  // ✏️ MODIFICATION
  // ================================
  showEditPopup = false;
  editPlan: PlanAbonnement | null = null;

  openEditPopup(plan: PlanAbonnement) {
    this.editPlan = { ...plan };
    this.showEditPopup = true;
  }

  closeEditPopup() {
    this.showEditPopup = false;
    this.editPlan = null;
  }

  saveEditPlan() {
    if (!this.editPlan) return;

    // ✅ Payload conforme à BadgePlanRequest
    const payload = {
      name: this.editPlan.name,
      description: this.editPlan.description,
      monthlyPrice: this.editPlan.monthlyPrice,
      yearlyDiscount: this.editPlan.yearlyDiscount
    };

    console.log('🟡 Payload envoyé au backend :', payload);

    this.planService
      .updatePlan(this.editPlan.id, payload)
      .subscribe({
        next: (res) => {
          console.log('🟢 UPDATE SUCCESS :', res);

          this.alertService.success(
            'Plan modifié avec succès',
            'light'
          );

          this.loadPlans();
          this.closeEditPopup();
        },
        error: (err) => {
          console.error('🔴 UPDATE ERROR :', err?.error);

          this.alertService.error(
            "Erreur lors de la modification du plan",
            'light'
          );
        }
      });
  }

  // ================================
  // 👁️ VISUALISATION (MODAL)
  // ================================
  showViewModal = false;
  selectedPlanForView: PlanAbonnement | null = null;

  openViewModal(plan: PlanAbonnement) {
    this.selectedPlanForView = plan;
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedPlanForView = null;
  }

}
