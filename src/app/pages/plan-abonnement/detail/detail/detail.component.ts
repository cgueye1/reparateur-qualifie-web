import { Component } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { Location } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule, NgChartsModule,FormsModule],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent {

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }

  // ===============================
  // 🔵 DONNÉES DU PLAN
  // ===============================
  plan = {
    id: "1201010",
    nom: "ARTISAN PRO",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    actif: true,
    coutTotal: "14 900 F",
    type: "Mensuel",
    remise: "0%",
    fonctionnalites: [
      "Lorem Ipsum is simply dummy text",
      "Lorem Ipsum is simply dummy text"
    ]
  };

  abonnes = [
    { nom: "Ousmane DIALLO", role: "Menuisier", telephone: "77 222 22 22", photo: "https://i.pravatar.cc/150?img=31", active: true },
    { nom: "Maguette NDIAYE", role: "Traiteur", telephone: "77 333 33 33", photo: "https://i.pravatar.cc/150?img=15", active: true },
    { nom: "Al Amine SENE", role: "Plombier", telephone: "77 444 44 44", photo: "https://i.pravatar.cc/150?img=52", active: false }
  ];

  // ===============================
  // 🔵 POPUPS EXISTANTS
  // ===============================
  showActivatePopup = false;
  showDeactivatePopup = false;
  showDeletePopup = false;

  showSuccessActivate = false;
  showSuccessDeactivate = false;
  showSuccessDelete = false;

  selectedPlan: any = null;

  openActivationPopup() {
    this.selectedPlan = this.plan;
    this.showActivatePopup = true;
  }

  openDeactivate() {
    this.selectedPlan = this.plan;
    this.showDeactivatePopup = true;
  }

  openDelete() {
    this.selectedPlan = this.plan;
    this.showDeletePopup = true;
  }

  closeActivate() { this.showActivatePopup = false; }
  closeDeactivate() { this.showDeactivatePopup = false; }
  closeDelete() { this.showDeletePopup = false; }

  confirmActivate() {
    this.plan.actif = true;
    this.showActivatePopup = false;
    this.showSuccessActivate = true;

    setTimeout(() => { this.showSuccessActivate = false; }, 1800);
  }

  confirmDeactivate() {
    this.plan.actif = false;
    this.showDeactivatePopup = false;
    this.showSuccessDeactivate = true;

    setTimeout(() => { this.showSuccessDeactivate = false; }, 1800);
  }

  confirmDelete() {
    this.showDeletePopup = false;
    this.showSuccessDelete = true;

    setTimeout(() => { this.showSuccessDelete = false; }, 1800);
  }

  // ===============================
  // 🟧 POPUP MODIFICATION DE PLAN
  // ===============================
  showEditPopup = false;
  showSuccessEdit = false;

  editPlan: any = {
    nom: "",
    coutTotal: "",
    type: "",
    remise: "",
    description: "",
    fonctionnalites: "",
    actif: true
  };

  // 👉 Ouvrir popup modification
  openEditPopup() {
    this.editPlan = {
      nom: this.plan.nom,
      coutTotal: this.plan.coutTotal.replace(" F", ""),
      type: this.plan.type,
      remise: this.plan.remise.replace("%", ""),
      description: this.plan.description,
      fonctionnalites: this.plan.fonctionnalites.join("\n"),
      actif: this.plan.actif
    };
    this.showEditPopup = true;
  }

  // 👉 Fermer popup modification
  closeEditPopup() {
    this.showEditPopup = false;
  }

  // 👉 Sauvegarder modification
  saveEditPlan() {
    this.plan.nom = this.editPlan.nom;
    this.plan.coutTotal = this.editPlan.coutTotal + " F";
    this.plan.type = this.editPlan.type;
    this.plan.remise = this.editPlan.remise + "%";
    this.plan.description = this.editPlan.description;
    this.plan.fonctionnalites = this.editPlan.fonctionnalites.split("\n");
    this.plan.actif = this.editPlan.actif;

    this.showEditPopup = false;
    this.showSuccessEdit = true;

    setTimeout(() => {
      this.showSuccessEdit = false;
    }, 1800);
  }

  // ===============================
  // 📊 GRAPH DONUT
  // ===============================
  donutLabels = ['Payé • 75%', 'Impayé • 25%'];
  donutData: any;
  donutOptions: any;

  ngOnInit(): void {
    this.initDonutChart();
  }

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
