import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModerationAvisService } from '../../../core/service/pages/moderation-avis/moderation-avis.service';
import { Rating, RatingStats } from '../../../models/pages/moderation-avis/moderation-avis';

@Component({
  selector: 'app-moderation-avis',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './moderation-avis.component.html',
  styleUrl: './moderation-avis.component.css'
})
export class ModerationAvisComponent implements OnInit {

  constructor(private moderationService: ModerationAvisService) { }

  // 📌 STATISTIQUES
  stats: RatingStats = {
    totalRatings: 0,
    pending: 0,
    solved: 0,
    ok: 0,
    hidden: 0
  };
  loadingStats = false;

  // 📌 LISTE DES AVIS
  ratings: Rating[] = [];
  loading = false;

  // 📌 PAGINATION
  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;

  // 📌 FILTRES
  selectedStatus: string = ''; // Filtre par statut

  // 🔍 CHAMP RECHERCHE
  searchText: string = '';

  // ===============================
  // 🔄 INITIALISATION
  // ===============================
  ngOnInit(): void {
    this.loadStats();
    this.loadRatings();
  }

  // ===============================
  // 📊 CHARGER LES STATISTIQUES
  // ===============================
  loadStats() {
    this.loadingStats = true;

    this.moderationService.getRatingStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        console.log('✅ Stats chargées:', stats);
        this.loadingStats = false;
      },
      error: (err) => {
        console.error('❌ Erreur chargement stats:', err);
        this.loadingStats = false;
      }
    });
  }

  // ===============================
  // 📋 CHARGER LA LISTE DES AVIS
  // ⚠️ ENDPOINT NON DISPONIBLE - Fonctionnalité désactivée temporairement
  // ===============================
  loadRatings() {
    this.loading = true;

    // ⚠️ L'API ne fournit pas d'endpoint pour lister tous les avis
    // Seuls les endpoints par userId sont disponibles:
    // - GET /api/ratings/received/{userId}
    // - GET /api/ratings/given-by-user/{userId}

    console.warn('⚠️ Endpoint /api/ratings non disponible dans l\'API');
    this.ratings = [];
    this.loading = false;

    // TODO: Demander au backend d'ajouter:
    // GET /api/ratings?status={status}&page={page}&size={size}
    // pour permettre la modération globale des avis
  }

  // 🔍 FILTRAGE DES AVIS
  get filteredAvis() {
    if (!this.searchText.trim()) return this.ratings;

    return this.ratings.filter(rating => {
      const auteur = `${rating.reviewer?.prenom || ''} ${rating.reviewer?.nom || ''}`.toLowerCase();
      const contenu = (rating.comment || '').toLowerCase();
      const raison = (rating.reportReason || '').toLowerCase();
      const search = this.searchText.toLowerCase();

      return auteur.includes(search) || contenu.includes(search) || raison.includes(search);
    });
  }

  // ===============================
  // 🎨 FORMATER LA DATE
  // ===============================
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  }

  // ===============================
  // 🎨 OBTENIR LE NOM COMPLET
  // ===============================
  getAuthorName(rating: Rating): string {
    if (!rating.reviewer) return 'Anonyme';
    return `${rating.reviewer.prenom || ''} ${rating.reviewer.nom || ''}`.trim();
  }

  // ===============================
  // 🎨 MAPPER LE STATUT POUR L'AFFICHAGE
  // ===============================
  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'Signalé',
      'VALIDATED': 'Publié',
      'REJECTED': 'Rejeté',
      'HIDDEN': 'Masqué'
    };
    return statusMap[status] || status;
  }














  // POPUPS VISIBILITY
  showApprovePopup = false;
  showMaskPopup = false;
  showDeletePopup = false;

  showSuccessApprove = false;
  showSuccessMask = false;
  showSuccessDelete = false;

  showHistoryPopup = false;

  // ELEMENT SELECTIONNÉ
  selectedAvis: any = null;

  // === OPEN POPUPS ===
  openApprovePopup(avis: any) {
    this.selectedAvis = avis;
    this.showApprovePopup = true;
  }

  openMaskPopup(avis: any) {
    this.selectedAvis = avis;
    this.showMaskPopup = true;
  }

  openDeletePopup(avis: any) {
    this.selectedAvis = avis;
    this.showDeletePopup = true;
  }

  openHistoryPopup(avis: any) {
    this.selectedAvis = avis;
    this.showHistoryPopup = true;
  }

  // === CLOSE POPUPS ===
  closePopups() {
    this.showApprovePopup = false;
    this.showMaskPopup = false;
    this.showDeletePopup = false;
    this.showHistoryPopup = false;
  }

  // === CONFIRM ACTIONS ===
  confirmApprove() {
    if (!this.selectedAvis) return;

    this.moderationService.updateRatingStatus(this.selectedAvis.id, { status: 'VALIDATED' })
      .subscribe({
        next: () => {
          this.showApprovePopup = false;
          this.showSuccessApprove = true;

          setTimeout(() => {
            this.showSuccessApprove = false;
            this.loadRatings(); // Recharger la liste
            this.loadStats();   // Recharger les stats
          }, 1500);
        },
        error: (err) => {
          console.error('❌ Erreur approbation:', err);
          this.showApprovePopup = false;
        }
      });
  }

  confirmMask() {
    if (!this.selectedAvis) return;

    this.moderationService.updateRatingStatus(this.selectedAvis.id, { status: 'HIDDEN' })
      .subscribe({
        next: () => {
          this.showMaskPopup = false;
          this.showSuccessMask = true;

          setTimeout(() => {
            this.showSuccessMask = false;
            this.loadRatings();
            this.loadStats();
          }, 1500);
        },
        error: (err) => {
          console.error('❌ Erreur masquage:', err);
          this.showMaskPopup = false;
        }
      });
  }

  confirmDelete() {
    if (!this.selectedAvis) return;

    this.moderationService.updateRatingStatus(this.selectedAvis.id, { status: 'REJECTED' })
      .subscribe({
        next: () => {
          this.showDeletePopup = false;
          this.showSuccessDelete = true;

          setTimeout(() => {
            this.showSuccessDelete = false;
            this.loadRatings();
            this.loadStats();
          }, 1500);
        },
        error: (err) => {
          console.error('❌ Erreur suppression:', err);
          this.showDeletePopup = false;
        }
      });
  }

}
