import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: 'app-plan-abonnement',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule, RouterModule,FormsModule],
  templateUrl: './plan-abonnement.component.html',
  styleUrl: './plan-abonnement.component.css'
})
export class PlanAbonnementComponent {
  plans = [
    {
      nom: "Artisan Pro",
      description: "Lorem Ipsum is simply dummy text",
      coutTotal: "14 900 Fcfa",
      type: "Mensuel",
      remise: "0%",
      active: true
    },
    {
      nom: "Artisan Pro",
      description: "Lorem Ipsum is simply dummy text",
      coutTotal: "79 900 Fcfa",
      type: "Annuel",
      remise: "20%",
      active: false
    },
    {
      nom: "Client Basic",
      description: "Lorem Ipsum is simply dummy text",
      coutTotal: "5 000 Fcfa",
      type: "Mensuel",
      remise: "0%",
      active: true
    },
    {
      nom: "Client Premium",
      description: "Lorem Ipsum is simply dummy text",
      coutTotal: "50 000 Fcfa",
      type: "Annuel",
      remise: "15%",
      active: true
    }
  ];

  searchTerm = "";

  // Statistiques
  get totalPlans() {
    return this.plans.length;
  }

  get plansActifs() {
    return this.plans.filter(p => p.active).length;
  }

  get plansInactifs() {
    return this.plans.filter(p => !p.active).length;
  }

  get abonnesActifs() {
    return 3; // Nombre statique pour l'exemple
  }

  // Filtrage recherche
  get filteredPlans() {
    return this.plans.filter(p =>
      p.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // ===============================
  // 🔵 GESTION DES ACTIONS
  // ===============================

  toggleStatus(plan: any) {
    this.selectedPlan = plan;

    if (plan.active) {
      this.showDeactivatePopup = true;
    } else {
      this.showActivatePopup = true;
    }
  }

  openDeletePopup(plan: any) {
    this.selectedPlan = plan;
    this.showDeletePopup = true;
  }

  // ===============================
  // 🔵 POPUPS ACTIVATION / DESACTIVATION / SUPPRESSION
  // ===============================

  // État des popups
  showActivatePopup: boolean = false;
  showDeactivatePopup: boolean = false;
  showDeletePopup: boolean = false;

  // Popups success
  showSuccessActivate: boolean = false;
  showSuccessDeactivate: boolean = false;
  showSuccessDelete: boolean = false;

  // Plan sélectionné
  selectedPlan: any = null;

  // 👉 Fermer popup Activer
  closeActivate() {
    this.showActivatePopup = false;
  }

  // 👉 Fermer popup Désactiver
  closeDeactivate() {
    this.showDeactivatePopup = false;
  }

  // 👉 Fermer popup Supprimer
  closeDelete() {
    this.showDeletePopup = false;
  }

  // 👉 Confirmer ACTIVATION
  confirmActivate() {
    if (this.selectedPlan) {
      this.selectedPlan.active = true;
    }

    this.showActivatePopup = false;
    this.showSuccessActivate = true;

    setTimeout(() => {
      this.showSuccessActivate = false;
    }, 1800);
  }

  // 👉 Confirmer DESACTIVATION
  confirmDeactivate() {
    if (this.selectedPlan) {
      this.selectedPlan.active = false;
    }

    this.showDeactivatePopup = false;
    this.showSuccessDeactivate = true;

    setTimeout(() => {
      this.showSuccessDeactivate = false;
    }, 1800);
  }

  // 👉 Confirmer SUPPRESSION
  confirmDelete() {
    if (this.selectedPlan) {
      const index = this.plans.indexOf(this.selectedPlan);
      if (index > -1) {
        this.plans.splice(index, 1);
      }
    }

    this.showDeletePopup = false;
    this.showSuccessDelete = true;

    setTimeout(() => {
      this.showSuccessDelete = false;
    }, 1800);
  }
}
