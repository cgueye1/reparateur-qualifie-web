import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Location } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-detail-client',
  standalone: true,
  imports: [CommonModule, NgIf, NgChartsModule],
  templateUrl: './detail-client.component.html',
  styleUrl: './detail-client.component.css'
})
export class DetailClientComponent {

  constructor(private location: Location) {}

  // 📌 TAB SELECTION CONSERVÉE
  tab: string = localStorage.getItem('activeClientTab') || 'overview';

  changeTab(tab: string) {
    this.tab = tab;
    localStorage.setItem('activeClientTab', tab);
  }

  // 📌 DONNÉES CLIENT
  user: any;

  ngOnInit(): void {
    this.user = {
      id: '1201015',
      nom: 'Moussa Wade',
      photo: '',
      initials: 'MW',
      active: true,
      metier: 'Client',
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



  // ============================================================================
  // ⭐⭐⭐  EVALUATIONS
  // ============================================================================
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




  // ============================================================================
  // 🍩  DONUT CHART (Répartition des avis)
  // ============================================================================
  donutLabels = ['5 étoiles (50%)', '4 étoiles (15%)', '3 étoiles (30%)', '2 étoiles (5%)'];
  donutData: any;
  donutOptions: any;

  initDonutChart() {
    this.donutData = {
      labels: this.donutLabels,
      datasets: [
        {
          data: [50, 15, 30, 5],
          backgroundColor: ['#22C55F', '#F59E0C', '#3B83F6', '#EF4444'],
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



  // ============================================================================
  // 📈  LINE CHART (Vues du profil)
  // ============================================================================
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
          tension: 0,

          pointRadius: 3,
          pointBackgroundColor: '#FFFFFF',
          pointBorderColor: '#E95F32',
          pointBorderWidth: 1,

          borderWidth: 2
        }
      ]
    };

    this.viewsOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#888' }, grid: { display: false } },
        y: { ticks: { color: '#888' }, grid: { color: '#F1F1F1', drawBorder: false } }
      }
    };
  }



  // ============================================================================
  // 👨‍🔧  ARTISANS AJOUTÉS
  // ============================================================================
  artisansAjoutes = [
    { nom: "Moussa Wade", metier: "Plombier", tel: "77 000 00 00", date: "2025-01-15", statut: true },
    { nom: "Lamine Niang", metier: "Plombier", tel: "77 111 11 11", date: "2025-01-15", statut: false },
    { nom: "Ousmane DIALLO", metier: "Menuisier", tel: "77 222 22 22", date: "2025-01-15", statut: true },
  ];



  // ============================================================================
  // 🔄  PROFILS PARTAGÉS (copie des artisans)
  // ============================================================================
  profilsPartages = [...this.artisansAjoutes];



  // ============================================================================
  // 📌 TITRES DES PAGES SELON ONGLET
  // ============================================================================
  get pageTitle(): string {
    switch (this.tab) {
      case 'overview': return 'Vue d’ensemble';
      case 'artisans': return 'Artisans ajoutés';
      case 'profils': return 'Profils partagés';
      case 'evaluations': return 'Évaluations';
      default: return '';
    }
  }

}
