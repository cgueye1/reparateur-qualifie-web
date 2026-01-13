import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';

import { UtilisateurService } from '../../../core/service/pages/utilisateurs/utilisateur.service';
import { SwettAlerteService } from '../../../core/service/alerte/swett-alerte.service';
import { User } from '../../../models/pages/utilisateurs/utilisateur';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [NgIf, CommonModule, NgChartsModule,FormsModule],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  // =====================================================
  // 👤 UTILISATEUR (TYPÉ)
  // =====================================================
  user: User | null = null;
  loading = false;

  // =====================================================
  // 🧭 ONGLET
  // =====================================================
  tab: string = localStorage.getItem('activeTab') || 'overview';

  // =====================================================
  // 🔵 POPUPS DE CONFIRMATION
  // =====================================================
  showActivatePopup = false;
  showDeactivatePopup = false;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private userService: UtilisateurService,
    private alertService: SwettAlerteService
  ) {}

  // =====================================================
  // 🔄 INIT
  // =====================================================
  ngOnInit(): void {
    this.loadUserDetail();
    this.initDonutChart();
    this.initLineChart();
  }

  // =====================================================
  // 📡 API — DÉTAIL UTILISATEUR
  // =====================================================
  loadUserDetail(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    this.loading = true;

    this.userService.getUserById(id).subscribe({
      next: (res: User) => {
        this.user = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.alertService.error(
          "Erreur lors du chargement du détail de l'utilisateur",
          'light'
        );
      }
    });
  }

  // =====================================================
  // 🟢 OUVERTURE DES POPUPS
  // =====================================================
  openActivatePopup(): void {
    this.showActivatePopup = true;
  }

  openDeactivatePopup(): void {
    this.showDeactivatePopup = true;
  }

  // =====================================================
  // ❌ FERMETURE DES POPUPS
  // =====================================================
  closeActivate(): void {
    this.showActivatePopup = false;
  }

  closeDeactivate(): void {
    this.showDeactivatePopup = false;
  }

  // =====================================================
  // 🔁 CONFIRMATION — APPEL API
  // =====================================================
  confirmActivate(): void {
  if (!this.user) return;

  this.userService.toggleActivation(this.user.id).subscribe({
    next: () => {
      this.user!.activated = true;

      // ✅ fermer le popup de confirmation
      this.showActivatePopup = false;

      this.alertService.success(
        'Compte activé avec succès',
        'light'
      );
    },
    error: () => {
      this.alertService.error(
        "Impossible d’activer le compte",
        'light'
      );
    }
  });
}


  confirmDeactivate(): void {
  if (!this.user) return;

  this.userService.toggleActivation(this.user.id).subscribe({
    next: () => {
      this.user!.activated = false;

      // ✅ fermer le popup de confirmation
      this.showDeactivatePopup = false;

      this.alertService.success(
        'Compte désactivé avec succès',
        'light'
      );
    },
    error: () => {
      this.alertService.error(
        "Impossible de désactiver le compte",
        'light'
      );
    }
  });
}


  // =====================================================
  // 🧭 NAVIGATION & ONGLET
  // =====================================================
  goBack(): void {
    this.location.back();
  }

  changeTab(tab: string): void {
    this.tab = tab;
    localStorage.setItem('activeTab', tab);
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

  // =====================================================
  // 📊 GRAPHIQUES (MOCK)
  // =====================================================
  donutLabels = [
    '5 étoiles (50%)',
    '4 étoiles (15%)',
    '3 étoiles (30%)',
    '2 étoiles (5%)'
  ];

  donutData: any;
  donutOptions: any;

  initDonutChart(): void {
    this.donutData = {
      labels: this.donutLabels,
      datasets: [{
        data: [50, 15, 30, 5],
        backgroundColor: ['#22C55F', '#F59E0C', '#3B83F6', '#EF4444'],
        borderWidth: 0
      }]
    };

    this.donutOptions = {
      cutout: '70%',
      plugins: { legend: { display: false } }
    };
  }

  viewsData: any;
  viewsOptions: any;

  initLineChart(): void {
    this.viewsData = {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai'],
      datasets: [{
        label: 'Vues',
        data: [15, 12, 20, 10, 14],
        borderColor: '#E95F32',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#E95F32'
      }]
    };

    this.viewsOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: '#F1F1F1' } }
      }
    };
  }
}
