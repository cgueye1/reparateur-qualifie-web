import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PubliciteService } from '../../../core/service/pages/publicite/publicite.service';
import { SwettAlerteService } from '../../../core/service/alerte/swett-alerte.service';

@Component({
  selector: 'app-publicite',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './publicite.component.html',
  styleUrl: './publicite.component.css'
})
export class PubliciteComponent implements OnInit {

  constructor(
    private publiciteService: PubliciteService,
    private alertService: SwettAlerteService
  ) { }

  /* ============================================================
   * 🔢 STATISTIQUES (API /api/ads/stats)
   * ============================================================ */
  stats = {
    total: 0,
    actives: 0,
    inactives: 0
  };

  ngOnInit(): void {
    this.loadStats();
  }

  /** Charger les statistiques depuis l’API */
  loadStats() {
    this.publiciteService.getAdsStats().subscribe({
      next: (res) => {
        this.stats = {
          total: res.totalAds,
          actives: res.activeAds,
          inactives: res.inactiveAds
        };
      },
      error: () => {
        this.alertService.error(
          "Erreur lors du chargement des statistiques",
          'light'
        );
      }
    });
  }

  /* ============================================================
   * 📌 LISTE DES PUBLICITÉS (MOCK – PAS DE GET POUR LE MOMENT)
   * ============================================================ */
  pubs = [
    {
      id: 1,
      titre: "Promotion Matériaux de Construction",
      description: "Jusqu'à 30% de réduction sur tous les matériaux",
      image: "pub.jpg",
      vues: 1250,
      clics: 87,
      cibles: "Tous",
      taux: 12,
      periode: "Du 01/03/2025 au 01/04/2025",
      active: true
    },
    {
      id: 2,
      titre: "Promotion Matériaux de Construction",
      description: "Jusqu'à 30% de réduction sur tous les matériaux",
      image: "pub1.jpg",
      vues: 1250,
      clics: 87,
      cibles: "Tous",
      taux: 12,
      periode: "Du 01/03/2025 au 01/04/2025",
      active: false
    }
  ];

  /* ============================================================
   * 🔍 RECHERCHE
   * ============================================================ */
  searchText = '';

  get filteredPubs() {
    if (!this.searchText.trim()) return this.pubs;
    return this.pubs.filter(pub =>
      pub.titre.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  /* ============================================================
   * 🔢 PAGINATION (MOCK)
   * ============================================================ */
  page = 1;
  pageSize = 10;

  get totalPages() {
    return Math.ceil(this.filteredPubs.length / this.pageSize);
  }

  nextPage() {
    if (this.page < this.totalPages) this.page++;
  }

  prevPage() {
    if (this.page > 1) this.page--;
  }

  /* ============================================================
   * 🚦 POPUPS ACTIVER / DÉSACTIVER
   * ============================================================ */
  showActivatePopup = false;
  showDeactivatePopup = false;

  selectedPub: any = null;

  openActivatePopup(pub: any) {
    this.selectedPub = pub;
    this.showActivatePopup = true;
  }

  openDeactivatePopup(pub: any) {
    this.selectedPub = pub;
    this.showDeactivatePopup = true;
  }

  closePopups() {
    this.showActivatePopup = false;
    this.showDeactivatePopup = false;
  }

  /** Activation simulée */
  confirmActivate() {
    if (this.selectedPub) {
      this.selectedPub.active = true;
    }

    this.closePopups();

    this.alertService.success(
      'Publicité activée avec succès',
      'light'
    );
  }

  /** Désactivation simulée */
  confirmDeactivate() {
    if (this.selectedPub) {
      this.selectedPub.active = false;
    }

    this.closePopups();

    this.alertService.success(
      'Publicité désactivée avec succès',
      'light'
    );
  }

  /* ============================================================
   * ➕ CRÉATION D’UNE PUBLICITÉ (API POST)
   * ============================================================ */
  showCreatePopup = false;

  pubForm: any = {
    titre: '',
    description: '',
    lien: '',
    dateDebut: '',
    dateFin: '',
    permanent: false,
    image: null,
    imageName: ''
  };

  openCreatePopup() {
    this.showCreatePopup = true;
  }

  closeCreatePopup() {
    this.showCreatePopup = false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.pubForm.image = file;
      this.pubForm.imageName = file.name;
    }
  }

  submitPub() {
    const formData = new FormData();

    formData.append('title', this.pubForm.titre);
    formData.append('description', this.pubForm.description);
    formData.append('link', this.pubForm.lien);
    formData.append('startDate', this.pubForm.dateDebut);
    formData.append('endDate', this.pubForm.dateFin);
    formData.append('permanent', String(this.pubForm.permanent));

    if (this.pubForm.image) {
      formData.append('webImg', this.pubForm.image);
    }

    this.publiciteService.addAd(formData).subscribe({
      next: () => {
        this.closeCreatePopup();
        this.alertService.success(
          'Publicité créée avec succès',
          'light'
        );
      },
      error: (er) => {
        console.error('Erreur lors de la création de la publicité:', er);
        this.alertService.error(
          "Erreur lors de la création de la publicité",
          'light'
        );
      }
    });
  }

  /* ============================================================
   * ✏️ MODIFICATION (API PUT)
   * ============================================================ */
  openEditPopup(pub: any) {
    this.selectedPub = { ...pub };
  }

  saveEditPub() {
    if (!this.selectedPub) return;

    const formData = new FormData();
    formData.append('title', this.selectedPub.titre);
    formData.append('description', this.selectedPub.description);
    formData.append('link', this.selectedPub.lien || '');

    this.publiciteService.updateAd(this.selectedPub.id, formData).subscribe({
      next: () => {
        this.alertService.success(
          'Publicité modifiée avec succès',
          'light'
        );
      },
      error: () => {
        this.alertService.error(
          "Erreur lors de la modification de la publicité",
          'light'
        );
      }
    });
  }

  /* ============================================================
   * 🗑️ SUPPRESSION (API DELETE)
   * ============================================================ */
  confirmDelete() {
    if (!this.selectedPub) return;

    this.publiciteService.deleteAd(this.selectedPub.id).subscribe({
      next: () => {
        this.pubs = this.pubs.filter(p => p.id !== this.selectedPub.id);

        this.alertService.success(
          'Publicité supprimée avec succès',
          'light'
        );
      },
      error: () => {
        this.alertService.error(
          "Erreur lors de la suppression de la publicité",
          'light'
        );
      }
    });
  }

}
