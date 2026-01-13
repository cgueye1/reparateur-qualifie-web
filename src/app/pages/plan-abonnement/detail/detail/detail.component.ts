import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

import { PlanAbonnementService } from '../../../../core/service/plan-abonnement/plan-abonnement.service';
import { SwettAlerteService } from '../../../../core/service/alerte/swett-alerte.service';
import { PlanAbonnement } from '../../../../models/pages/plan-d\'abonnement/plan-abonnement';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule, NgChartsModule, FormsModule],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private planService: PlanAbonnementService,
    private alertService: SwettAlerteService
  ) {}

  goBack() {
    this.location.back();
  }

  // ===============================
  // 🔵 DONNÉES DU PLAN (API)
  // ===============================
  plan: PlanAbonnement | null = null;
  loading = false;

  // ===============================
  // 🔵 ABONNÉS (MOCK — À CONNECTER PLUS TARD)
  // ===============================
  abonnes = [
    { nom: "Ousmane DIALLO", role: "Menuisier", telephone: "77 222 22 22", photo: "https://i.pravatar.cc/150?img=31", active: true },
    { nom: "Maguette NDIAYE", role: "Traiteur", telephone: "77 333 33 33", photo: "https://i.pravatar.cc/150?img=15", active: true },
    { nom: "Al Amine SENE", role: "Plombier", telephone: "77 444 44 44", photo: "https://i.pravatar.cc/150?img=52", active: false }
  ];

  // ===============================
  // 🔵 POPUPS (CONFIRMATION OK)
  // ===============================
  showActivatePopup = false;
  showDeactivatePopup = false;
  showDeletePopup = false;

  // ❌ POPUPS SUCCESS (DÉSACTIVÉS — GÉRÉS PAR SwettAlerteService)
  // showSuccessActivate = false;
  // showSuccessDeactivate = false;
  // showSuccessDelete = false;


// ================================
  // 🗑️ SUPPRESSION
  // ================================
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







  // ===============================
  // ✏️ MODIFICATION DU PLAN
  // ===============================
  showEditPopup = false;
  editPlan: Partial<PlanAbonnement> | null = null;

  ngOnInit(): void {
    this.loadPlanDetail();
    this.initDonutChart();
  }

  // ===============================
  // 📌 RÉCUPÉRATION DU PLAN PAR ID
  // ===============================
  loadPlanDetail() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.alertService.error('ID du plan invalide', 'light');
      return;
    }

    this.loading = true;

    console.log('🟡 ID récupéré depuis l’URL :', id);

    this.planService.getPlanById(id).subscribe({
      next: (res) => {
        console.log('🟢 Plan récupéré depuis l’API :', res);
        this.plan = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('🔴 Erreur récupération plan :', err);
        this.loading = false;
        this.alertService.error(
          "Erreur lors du chargement du détail du plan",
          'light'
        );
      }
    });
  }

  // ===============================
  // ✏️ OUVRIR MODIFICATION
  // ===============================
  openEditPopup() {
    if (!this.plan) return;

    this.editPlan = {
      name: this.plan.name,
      description: this.plan.description,
      monthlyPrice: this.plan.monthlyPrice
      // ❌ yearlyDiscount non accepté par l’API
    };

    this.showEditPopup = true;
  }

  closeEditPopup() {
    this.showEditPopup = false;
    this.editPlan = null;
  }

  // ===============================
  // 💾 SAUVEGARDER MODIFICATION (API)
  // ===============================
  saveEditPlan() {
    if (!this.plan || !this.editPlan) return;

    console.log('🟡 Payload UPDATE envoyé :', this.editPlan);

    this.planService
      .updatePlan(this.plan.id, this.editPlan)
      .subscribe({
        next: () => {
          this.alertService.success(
            'Plan modifié avec succès',
            'light'
          );

          this.closeEditPopup();
          this.loadPlanDetail();
        },
        error: (err) => {
          console.error('🔴 Erreur UPDATE plan :', err);
          this.alertService.error(
            "Erreur lors de la modification du plan",
            'light'
          );
        }
      });
  }

  // ===============================
  // 📊 GRAPH DONUT (INCHANGÉ)
  // ===============================
  donutLabels = ['Payé • 75%', 'Impayé • 25%'];
  donutData: any;
  donutOptions: any;

  initDonutChart() {
    this.donutData = {
      labels: this.donutLabels,
      datasets: [
        {
          data: [75, 25],
          backgroundColor: ['#22C55F', '#EF4444'],
          borderWidth: 0,
          hoverOffset: 4,
        }
      ]
    };

    this.donutOptions = {
      cutout: '70%',
      plugins: { legend: { display: false } }
    };
  }
}
