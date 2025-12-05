import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Location } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [NgIf, CommonModule, NgChartsModule],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent {



  constructor(private location: Location) {}




evaluations = [
  {
    ref: "INV-2025002",
    date: "2025-02-15",
    user: "Alissatou Diop",
    stars: 5,
    comment: "Excellent travail, très professionnel et ponctuel. Je recommande vivement !"
  },
  {
    ref: "INV-2025001",
    date: "2025-02-15",
    user: "Issa Ndiaye",
    stars: 4,
    comment: "Bon service, travail de qualité"
  }
];

globalRating = 4.7;
totalReviews = 52;



  user: any;
  tab: string = localStorage.getItem('activeTab') || 'overview';

  changeTab(tab: string) {
  this.tab = tab;
  localStorage.setItem('activeTab', tab);
}

  stats = {
    missions: 27,
    revenus: 152000,
    avis: 18,
    note: 4.6
  };

  ngOnInit(): void {
    this.user = {
      id: '1201010',
      nom: 'Lamine Niang',
      photo: 'https://i.pravatar.cc/200',
      initials: 'LN',
      active: true,
      metier: 'Plombier',
      email: 'lamine.niang@gmail.com',
      telephone: '70 645 87 92',
      ville: 'Dakar - Médina',
      dateInscription: '11/10/2025',
    };

    this.initDonutChart();
    this.initLineChart();
  }

  goBack() { this.location.back(); }
  toggleStatus(state: boolean) { this.user.active = state; }

// =====================================================================================
// 🟢 GRAPH 1 : RÉPARTITION DES NOTES (DONUT)
// =====================================================================================

donutLabels = ['5 étoiles (50%)', '4 étoiles (15%)', '3 étoiles (30%)', '2 étoiles (5%)'];

donutData: any;
donutOptions: any;

initDonutChart() {
  this.donutData = {
    labels: this.donutLabels,
    datasets: [
      {
        data: [50, 15, 30, 5],
        backgroundColor: ['#22C55F', '#F59E0C', '#3B83F6', '#EF4444'], // 🔥 vraies couleurs
        borderWidth: 0,
        hoverOffset: 4,
      }
    ]
  };

  this.donutOptions = {
    cutout: '70%',
    plugins: {
      legend: { display: false }
    }
  };
}


  // ================================
  // 📈 LINE CHART
  // ================================

  viewsData: any;
  viewsOptions: any;

  initLineChart() {
    this.viewsData = {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai'],
     datasets: [
  {
    label: 'Vues',
    data: [15, 12, 20, 10, 14],
    borderColor: '#E95F32',
    backgroundColor: 'transparent',
    tension: 0.0,

    // 🎯 STYLE DES POINTS
    pointRadius: 3,                      // un peu plus grand (visible)
    pointBackgroundColor: '#FFFFFF',     // centre blanc
    pointBorderColor: '#E95F32',         // bordure de la couleur du graph
    pointBorderWidth: 1,                 // épaisseur de la bordure

    borderWidth: 2
  }
]
    };

    this.viewsOptions = {
      responsive: true,
      maintainAspectRatio: false,   // 🔥 OBLIGATOIRE pour que le graph soit grand
      plugins: { legend: { display: false } },
      scales: {
        x: {
          ticks: { color: '#888' },
          grid: { display: false }
        },
        y: {
          ticks: { color: '#888' },
          grid: { color: '#F1F1F1', drawBorder: false }
        }
      }
    };
  }

  get pageTitle(): string {
  switch (this.tab) {
    case 'overview': return 'Vue d’ensemble';
    case 'paiements': return 'Historique des paiements';
    case 'documents': return 'Documents';
    case 'evaluations': return 'Évaluations';
    default: return '';
  }
}



// ===============================
// 🔵 POPUPS ACTIVATION / DESACTIVATION
// ===============================

// État des popups
showActivatePopup: boolean = false;
showDeactivatePopup: boolean = false;

// Popups success
showSuccessActivate: boolean = false;
showSuccessDeactivate: boolean = false;

// utilisateur sélectionné
selectedUser: any = null;


// 👉 Ouvrir popup Activer
openActivatePopup(user: any) {
  this.selectedUser = user;
  this.showActivatePopup = true;
}

// 👉 Ouvrir popup Désactiver
openDeactivatePopup(user: any) {
  this.selectedUser = user;
  this.showDeactivatePopup = true;
}

// 👉 Fermer popup Activer
closeActivate() {
  this.showActivatePopup = false;
}

// 👉 Fermer popup Désactiver
closeDeactivate() {
  this.showDeactivatePopup = false;
}


// 👉 Confirmer ACTIVATION
confirmActivate() {
  if (this.selectedUser) {
    this.selectedUser.active = true; // met à jour le statut
  }

  this.showActivatePopup = false;
  this.showSuccessActivate = true;

  setTimeout(() => {
    this.showSuccessActivate = false;
  }, 1800);
}


// 👉 Confirmer DESACTIVATION
confirmDeactivate() {
  if (this.selectedUser) {
    this.selectedUser.active = false;
  }

  this.showDeactivatePopup = false;
  this.showSuccessDeactivate = true;

  setTimeout(() => {
    this.showSuccessDeactivate = false;
  }, 1800);
}


}
