import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';

import { UtilisateurService } from '../../../core/service/pages/utilisateurs/utilisateur.service';
import { SwettAlerteService } from '../../../core/service/alerte/swett-alerte.service';
import { User, RatingDistribution, RatingDistributionResponse } from '../../../models/pages/utilisateurs/utilisateur';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [NgIf, CommonModule, NgChartsModule, FormsModule],
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
  // 📊 RÉPARTITION DES NOTES
  // =====================================================
  ratingDistribution: RatingDistribution[] = [];
  totalRatings = 0;

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
  ) { }

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
        this.loadRatingDistribution(id);
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
  // 📡 API — RÉPARTITION DES NOTES
  // =====================================================
  loadRatingDistribution(userId: number): void {
    this.userService.getRatingDistribution(userId).subscribe({
      next: (res: RatingDistributionResponse) => {
        // ✅ TOUJOURS afficher les 4 notes (2-5 étoiles), même à 0%
        // Ordre décroissant : 5 → 4 → 3 → 2
        this.ratingDistribution = [
          { score: 5, percentage: res.percent5 },
          { score: 4, percentage: res.percent4 },
          { score: 3, percentage: res.percent3 },
          { score: 2, percentage: res.percent2 }
        ];

        this.totalRatings = res.totalRatings;
        this.initDonutChart();
      },
      error: () => {
        // En cas d'erreur, initialiser avec 0%
        this.ratingDistribution = [
          { score: 5, percentage: 0 },
          { score: 4, percentage: 0 },
          { score: 3, percentage: 0 },
          { score: 2, percentage: 0 }
        ];
        this.totalRatings = 0;
        this.initDonutChart();
      }
    });
  }

  // =====================================================
  // � OUVERTURE DES POPUPS
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
  // 📊 GRAPHIQUES
  // =====================================================
  donutData: any;
  donutOptions: any;

  initDonutChart(): void {
    // ✅ Formatage des pourcentages : 1 décimale max (33.333333 → 33.3%)
    const labels = this.ratingDistribution.map(r => {
      const formattedPercent = r.percentage % 1 === 0
        ? r.percentage.toFixed(0)  // Entier : "50"
        : r.percentage.toFixed(1);  // Décimale : "33.3"
      return `${r.score} étoiles (${formattedPercent}%)`;
    });

    const data = this.ratingDistribution.map(r => r.percentage);

    // Couleurs : 5★ vert, 4★ orange, 3★ bleu, 2★ rouge
    const colors = ['#22C55F', '#F59E0C', '#3B83F6', '#EF4444'];

    this.donutData = {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderWidth: 0
      }]
    };

    this.donutOptions = {
      cutout: '70%',
      plugins: { legend: { display: false } }
    };
  }

  // =====================================================
  // 🎨 FORMATAGE POURCENTAGE (max 1 décimale)
  // =====================================================
  formatPercent(value: number | undefined): string {
    if (value === undefined || value === null) return '0';
    return value % 1 === 0
      ? value.toFixed(0)  // Entier : 50 → "50"
      : value.toFixed(1);  // Décimal : 33.333 → "33.3"
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
