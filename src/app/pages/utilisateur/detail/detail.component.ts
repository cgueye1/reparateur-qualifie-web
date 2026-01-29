import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';

import { UtilisateurService } from '../../../core/service/pages/utilisateurs/utilisateur.service';
import { SwettAlerteService } from '../../../core/service/alerte/swett-alerte.service';
import { User, RatingDistribution, RatingDistributionResponse, Document, ReceivedRating, Page } from '../../../models/pages/utilisateurs/utilisateur';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environments';
import { SharedModule } from '../../../shared/shared.module';

/**
 * Structure pour représenter une étoile
 */
interface Star {
  type: 'full' | 'partial' | 'empty';
  fillPercentage?: number;
}

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [NgIf, CommonModule, NgChartsModule, FormsModule, SharedModule],
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
  // 📄 DOCUMENTS
  // =====================================================
  documents: Document[] = [];

  // =====================================================
  // ⭐ ÉVALUATIONS REÇUES
  // =====================================================
  receivedRatings: ReceivedRating[] = [];
  averageRating = 0;
  ratingsLoading = false;

  // Pagination des évaluations
  currentRatingsPage = 0;
  ratingsPageSize = 10;
  totalRatingsPages = 0;
  totalRatingsElements = 0;

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
    this.loadDocuments();
    this.loadReceivedRatings();
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
        this.loadMonthlyProfileViews(id);
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
  // 📡 API — DOCUMENTS
  // =====================================================
  loadDocuments(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    this.userService.getUserDocuments(id).subscribe({
      next: (res: Document[]) => {
        this.documents = res;
      },
      error: () => {
        this.documents = [];
        this.alertService.error(
          'Erreur lors du chargement des documents',
          'light'
        );
      }
    });
  }

  /**
   * Télécharge un document
   */
  downloadDocument(fileUrl: string | null): void {
    if (!fileUrl) {
      this.alertService.error(
        'Aucun fichier disponible pour ce document',
        'light'
      );
      return;
    }

    this.userService.downloadDocument(fileUrl);
  }

  // =====================================================
  // 📊 API — ÉVALUATIONS REÇUES
  // =====================================================
  loadReceivedRatings(page: number = 0): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    this.ratingsLoading = true;

    this.userService.getReceivedRatings(id, page, this.ratingsPageSize).subscribe({
      next: (res: Page<ReceivedRating>) => {
        this.receivedRatings = res.content;
        this.currentRatingsPage = res.number;
        this.totalRatingsPages = res.totalPages;
        this.totalRatingsElements = res.totalElements;
        this.ratingsLoading = false;
      },
      error: () => {
        this.receivedRatings = [];
        this.ratingsLoading = false;
        this.alertService.error(
          'Erreur lors du chargement des évaluations',
          'light'
        );
      }
    });
  }

  /**
   * Change de page dans la pagination des évaluations
   */
  onRatingsPageChange(page: number): void {
    this.loadReceivedRatings(page);
  }

  /**
   * Change le nombre d'éléments par page
   */
  onRatingsPageSizeChange(): void {
    this.currentRatingsPage = 0; // Retour à la première page
    this.loadReceivedRatings(0);
  }

  /**
   * Page suivante
   */
  nextRatingsPage(): void {
    if (this.currentRatingsPage + 1 < this.totalRatingsPages) {
      this.currentRatingsPage++;
      this.loadReceivedRatings(this.currentRatingsPage);
    }
  }

  /**
   * Page précédente
   */
  prevRatingsPage(): void {
    if (this.currentRatingsPage > 0) {
      this.currentRatingsPage--;
      this.loadReceivedRatings(this.currentRatingsPage);
    }
  }

  /**
   * Index de départ pour l'affichage de pagination
   */
  get ratingsStartIndex(): number {
    if (this.totalRatingsElements === 0) return 0;
    return this.currentRatingsPage * this.ratingsPageSize + 1;
  }

  /**
   * Index de fin pour l'affichage de pagination
   */
  get ratingsEndIndex(): number {
    return Math.min((this.currentRatingsPage + 1) * this.ratingsPageSize, this.totalRatingsElements);
  }

  /**
   * Génère un tableau d'étoiles pour l'affichage avec support des étoiles partielles
   * @param score Note de 0 à 10 (API)
   * @returns Tableau de 5 étoiles avec leur type et pourcentage de remplissage
   */
  getStars(score: number): Star[] {
    const scoreOn5 = score / 2; // Convertir de 10 à 5
    const fullStars = Math.floor(scoreOn5);
    const partialFill = scoreOn5 - fullStars;

    const stars: Star[] = [];

    // Étoiles pleines
    for (let i = 0; i < fullStars; i++) {
      stars.push({ type: 'full' });
    }

    // Étoile partielle (si le reste est > 0)
    if (partialFill > 0 && fullStars < 5) {
      stars.push({
        type: 'partial',
        fillPercentage: partialFill * 100
      });
    }

    // Étoiles vides
    while (stars.length < 5) {
      stars.push({ type: 'empty' });
    }

    return stars;
  }

  /**
   * Arrondit la note moyenne à 1 décimale
   * @param rating Note moyenne
   * @returns Note arrondie
   */
  getRoundedRating(rating: number | undefined): string {
    if (!rating) return '0';
    return rating.toFixed(1);
  }

  /**
   * Formate une date ISO en format lisible
   * @param isoDate Date au format "2026-01-27T14:47:00.112678"
   * @returns Date au format "27-01-2026"
   */
  formatDate(isoDate: string): string {
    if (!isoDate) return '-';
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
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

  /**
   * Retourne la valeur numérique du pourcentage pour les bindings de style
   * @param value Pourcentage (0-100)
   * @returns Valeur numérique pour [style.width.%]
   */
  getPercentValue(value: number | undefined): number {
    if (value === undefined || value === null) return 0;
    return value;
  }

  viewsData: any;
  viewsOptions: any;

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
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
          datasets: [{
            label: 'Vues',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
  // 🖼️ HELPERS PHOTO & INITIALES (ALIGNÉS SUR DETAIL CLIENT)
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
}
