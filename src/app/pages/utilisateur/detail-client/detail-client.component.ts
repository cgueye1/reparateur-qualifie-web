import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';

import { UtilisateurService } from '../../../core/service/pages/utilisateurs/utilisateur.service';
import { SwettAlerteService } from '../../../core/service/alerte/swett-alerte.service';
import { User, RatingDistribution, RatingDistributionResponse, SponsoredUser, SharedProfile } from '../../../models/pages/utilisateurs/utilisateur';
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-detail-client',
  standalone: true,
  imports: [CommonModule, NgIf, NgChartsModule],
  templateUrl: './detail-client.component.html',
  styleUrl: './detail-client.component.css'
})
export class DetailClientComponent implements OnInit {

  // =====================================================
  // 👤 CLIENT
  // =====================================================
  user: User | null = null;
  loading = false;
  ratingDistribution: RatingDistribution[] = [];
  totalRatings = 0;
  sponsoredUsers: SponsoredUser[] = [];
  sponsoredUsersLoading = false;
  totalSponsoredUsers = 0;
  sharedProfiles: SharedProfile[] = [];
  sharedProfilesLoading = false;
  totalSharedProfiles = 0;

  // =====================================================
  // 🧭 ONGLET
  // =====================================================
  tab: string = localStorage.getItem('activeClientTab') || 'overview';

  changeTab(tab: string): void {
    this.tab = tab;
    localStorage.setItem('activeClientTab', tab);
  }

  // =====================================================
  // 🔵 POPUPS CONFIRMATION
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
    this.loadClientDetail();
  }

  // =====================================================
  // 📡 API — DÉTAIL CLIENT
  // =====================================================
  loadClientDetail(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    this.loading = true;

    this.userService.getUserById(id).subscribe({
      next: (res: User) => {
        this.user = res;
        this.loading = false;
        // Charger la répartition des notes
        this.loadRatingDistribution(id);
        // Charger les vues mensuelles du profil
        this.loadMonthlyProfileViews(id);
        // Charger les utilisateurs sponsorisés
        this.loadSponsoredUsers(id);
        // Charger les profils partagés
        this.loadSharedProfiles(id);
      },
      error: () => {
        this.loading = false;
        this.alertService.error(
          "Erreur lors du chargement du détail du client",
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
        // Transformer la réponse API en tableau pour l'affichage (ordre décroissant: 5 -> 2 étoiles)
        this.ratingDistribution = [
          { score: 5, percentage: res.percent5 },
          { score: 4, percentage: res.percent4 },
          { score: 3, percentage: res.percent3 },
          { score: 2, percentage: res.percent2 }
        ].filter(r => r.percentage > 0); // Ne garder que les notes qui ont un pourcentage > 0

        this.totalRatings = res.totalRatings;
        this.initDonutChart();
      },
      error: () => {
        // En cas d'erreur, on initialise avec des données vides
        this.ratingDistribution = [];
        this.totalRatings = 0;
        this.initDonutChart();
      }
    });
  }

  // =====================================================
  // 📡 API — VUES MENSUELLES DU PROFIL
  // =====================================================
  loadMonthlyProfileViews(userId: number): void {
    const currentYear = new Date().getFullYear(); // Année courante (2026)

    this.userService.getMonthlyProfileViews(userId, currentYear).subscribe({
      next: (res: { [key: string]: number }) => {
        // Mapping des numéros de mois vers les labels français
        const monthLabels: { [key: string]: string } = {
          '1': 'Jan', '2': 'Fév', '3': 'Mar', '4': 'Avr',
          '5': 'Mai', '6': 'Juin', '7': 'Juil', '8': 'Août',
          '9': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Déc'
        };

        const labels: string[] = [];
        const data: number[] = [];

        // Parcourir tous les mois (1-12) dans l'ordre
        for (let i = 1; i <= 12; i++) {
          const monthKey = i.toString();
          labels.push(monthLabels[monthKey]);
          data.push(res[monthKey] || 0);
        }

        // Mettre à jour le graphique avec les vraies données
        this.viewsData = {
          labels,
          datasets: [{
            label: 'Vues',
            data,
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
            y: {
              grid: { color: '#F1F1F1' },
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                precision: 0
              }
            }
          }
        };
      },
      error: () => {
        // En cas d'erreur, initialiser avec un graphique vide
        this.viewsData = {
          labels: [],
          datasets: [{
            label: 'Vues',
            data: [],
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
            y: {
              grid: { color: '#F1F1F1' },
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                precision: 0
              }
            }
          }
        };
      }
    });
  }

  // =====================================================
  // � API — UTILISATEURS SPONSORISÉS (ARTISANS AJOUTÉS)
  // =====================================================
  loadSponsoredUsers(sponsorId: number): void {
    this.sponsoredUsersLoading = true;

    this.userService.getSponsoredUsers(sponsorId).subscribe({
      next: (res) => {
        this.sponsoredUsers = res.content;
        this.totalSponsoredUsers = res.totalElements;
        this.sponsoredUsersLoading = false;
      },
      error: () => {
        this.sponsoredUsers = [];
        this.totalSponsoredUsers = 0;
        this.sponsoredUsersLoading = false;
        this.alertService.error(
          "Erreur lors du chargement des artisans ajoutés",
          'light'
        );
      }
    });
  }

  // =====================================================  // 📡 API — PROFILS PARTAGÉS
  // =====================================================
  loadSharedProfiles(userId: number): void {
    this.sharedProfilesLoading = true;

    this.userService.getSharedProfiles(userId).subscribe({
      next: (res) => {
        this.sharedProfiles = res.content;
        this.totalSharedProfiles = res.totalElements;
        this.sharedProfilesLoading = false;
      },
      error: () => {
        this.sharedProfiles = [];
        this.totalSharedProfiles = 0;
        this.sharedProfilesLoading = false;
        this.alertService.error(
          "Erreur lors du chargement des profils partagés",
          'light'
        );
      }
    });
  }

  // =====================================================  // �🔁 ACTIVER / DÉSACTIVER (API)
  // =====================================================
  openActivatePopup(): void {
    this.showActivatePopup = true;
  }

  openDeactivatePopup(): void {
    this.showDeactivatePopup = true;
  }

  closeActivate(): void {
    this.showActivatePopup = false;
  }

  closeDeactivate(): void {
    this.showDeactivatePopup = false;
  }

  confirmActivate(): void {
    if (!this.user) return;

    this.userService.toggleActivation(this.user.id).subscribe({
      next: () => {
        this.user!.activated = true;
        this.showActivatePopup = false;

        this.alertService.success(
          'Compte client activé avec succès',
          'light'
        );
      },
      error: () => {
        this.alertService.error(
          "Impossible d’activer le compte client",
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
        this.showDeactivatePopup = false;

        this.alertService.success(
          'Compte client désactivé avec succès',
          'light'
        );
      },
      error: () => {
        this.alertService.error(
          "Impossible de désactiver le compte client",
          'light'
        );
      }
    });
  }

  // =====================================================
  // 🔙 NAVIGATION
  // =====================================================
  goBack(): void {
    this.location.back();
  }

  // =====================================================
  // 🖼️ HELPERS PHOTO & INITIALES
  // =====================================================
  getUserPhotoUrl(): string | null {
    if (!this.user?.photo) return null;
    // Si l'URL est déjà complète (commence par http), la retourner telle quelle
    if (this.user.photo.startsWith('http')) {
      return this.user.photo;
    }
    // Sinon, construire l'URL complète avec le baseUrl de l'API
    return `${environment.imageUrl}/${this.user.photo}`;
  }

  getUserInitials(): string {
    if (!this.user) return '';
    const firstInitial = this.user.prenom?.charAt(0)?.toUpperCase() || '';
    const lastInitial = this.user.nom?.charAt(0)?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  }

  // =====================================================
  // 📌 TITRES SELON ONGLET
  // =====================================================
  get pageTitle(): string {
    switch (this.tab) {
      case 'overview': return 'Vue d’ensemble';
      case 'artisans': return 'Artisans ajoutés';
      case 'profils': return 'Profils partagés';
      case 'evaluations': return 'Évaluations';
      default: return '';
    }
  }

  // =====================================================

  // 📊 DONUT CHART (AVIS)
  // =====================================================
  donutData: any;
  donutOptions: any;

  initDonutChart(): void {
    // Si pas de données, on affiche un graphique vide
    if (this.ratingDistribution.length === 0) {
      this.donutData = {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
          borderWidth: 0
        }]
      };
    } else {
      // Couleurs par score (5 étoiles = vert, 4 = orange, 3 = bleu, 2 = rouge, 1 = gris)
      const colorMap: { [key: number]: string } = {
        5: '#22C55F',  // Vert
        4: '#F59E0C',  // Orange
        3: '#3B83F6',  // Bleu
        2: '#EF4444',  // Rouge
        1: '#9CA3AF'   // Gris
      };

      // Trier par score décroissant (5 -> 1)
      const sortedData = [...this.ratingDistribution].sort((a, b) => b.score - a.score);

      const labels = sortedData.map(r =>
        `${r.score} étoile${r.score > 1 ? 's' : ''} (${r.percentage.toFixed(0)}%)`
      );
      const data = sortedData.map(r => r.percentage);
      const colors = sortedData.map(r => colorMap[r.score] || '#9CA3AF');

      this.donutData = {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderWidth: 0
        }]
      };
    }

    this.donutOptions = {
      cutout: '70%',
      plugins: { legend: { display: false } }
    };
  }

  // =====================================================
  // 📈 LINE CHART (VUES PROFIL)
  // =====================================================
  viewsData: any;
  viewsOptions: any;
}
