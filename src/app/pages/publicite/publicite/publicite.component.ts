import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PubliciteService } from '../../../core/service/pages/publicite/publicite.service';
import { SwettAlerteService } from '../../../core/service/alerte/swett-alerte.service';
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-publicite',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './publicite.component.html',
  styleUrl: './publicite.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PubliciteComponent implements OnInit {

  constructor(
    private publiciteService: PubliciteService,
    private alertService: SwettAlerteService,
    private cdr: ChangeDetectorRef
  ) { }

  // Fermer le dropdown si on clique en dehors
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.showPermanentDropdown = false;
      this.cdr.markForCheck();
    }
  }

  /* ============================================================
   * 🔢 STATISTIQUES (API /api/ads/stats)
   * ============================================================ */
  stats = {
    total: 0,
    actives: 0,
    inactives: 0
  };
  loading = false;

  /** Construire l'URL complète de l'image */
  getImageUrl(imageName: string | undefined): string {
    if (!imageName) return 'assets/default-ad.png';
    if (imageName.startsWith('http')) return imageName;
    return `${environment.imageUrl}/${imageName}`;
  }

  /** Formater la période d'affichage */
  formatPeriode(pub: any): string {
    if (!pub.startDate && !pub.endDate) {
      return pub.permanent ? 'Permanent' : 'N/A';
    }
    const start = pub.startDate || '?';
    const end = pub.endDate || '?';
    return `${start} au ${end}`;
  }

  ngOnInit(): void {
    this.loadStats();
    this.loadAds();
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
        this.cdr.markForCheck();
      },
      error: () => {
        this.alertService.error(
          "Erreur lors du chargement des statistiques",
          'light'
        );
        this.cdr.markForCheck();
      }
    });
  }

  /* ============================================================
   * 📌 LISTE DES PUBLICITÉS (API)
   * ============================================================ */
  pubs: any[] = [];

  /** Charger les publicités depuis l'API */
  loadAds() {
    this.loading = true;
    this.cdr.markForCheck();

    this.publiciteService.getAds(this.page - 1, this.pageSize).subscribe({
      next: (response) => {
        this.pubs = response.content || [];
        this.totalPagesCount = response.totalPages || 1;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement publicités:', err);
        this.loading = false;
        this.pubs = [];
        this.cdr.markForCheck();
      }
    });
  }

  /* ============================================================
   * 🔍 RECHERCHE ET FILTRES
   * ============================================================ */
  searchText = '';
  permanentFilter: 'all' | 'permanent' | 'non-permanent' = 'all';
  showPermanentDropdown = false;

  get filteredPubs() {
    let filtered = this.pubs;

    // Filtre par recherche
    if (this.searchText.trim()) {
      filtered = filtered.filter(pub =>
        (pub.title || pub.titre || '').toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    // Filtre par permanence
    if (this.permanentFilter === 'permanent') {
      filtered = filtered.filter(pub => pub.permanent === true);
    } else if (this.permanentFilter === 'non-permanent') {
      filtered = filtered.filter(pub => pub.permanent === false);
    }

    return filtered;
  }

  togglePermanentFilter() {
    this.showPermanentDropdown = !this.showPermanentDropdown;
  }

  setPermanentFilter(filter: 'all' | 'permanent' | 'non-permanent') {
    this.permanentFilter = filter;
    this.showPermanentDropdown = false;
    this.cdr.markForCheck();
  }

  getPermanentFilterLabel(): string {
    switch (this.permanentFilter) {
      case 'permanent':
        return 'Permanent';
      case 'non-permanent':
        return 'Non permanent';
      default:
        return 'Tous les statuts';
    }
  }

  /* ============================================================
   * 🔢 PAGINATION (API)
   * ============================================================ */
  page = 1;
  pageSize = 10;
  totalPagesCount = 1;

  get totalPages() {
    return this.totalPagesCount;
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadAds();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadAds();
    }
  }

  selectedPub: any = null;

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
    imageName: '',
    mobileImage: null,
    mobileImageName: ''
  };

  openCreatePopup() {
    this.showCreatePopup = true;
  }

  closeCreatePopup() {
    this.showCreatePopup = false;
  }

  onFileSelected(event: any, type: 'web' | 'mobile') {
    const file = event.target.files[0];
    if (file) {
      if (type === 'web') {
        this.pubForm.image = file;
        this.pubForm.imageName = file.name;
      } else {
        this.pubForm.mobileImage = file;
        this.pubForm.mobileImageName = file.name;
      }
    }
  }

  submitPub() {
    const formData = new FormData();

    formData.append('title', this.pubForm.titre);
    formData.append('description', this.pubForm.description);
    formData.append('link', this.pubForm.lien);

    // Convertir les dates au format dd-MM-yyyy attendu par le backend
    if (this.pubForm.dateDebut) {
      formData.append('startDate', this.formatDateForBackend(this.pubForm.dateDebut));
    }
    if (this.pubForm.dateFin) {
      formData.append('endDate', this.formatDateForBackend(this.pubForm.dateFin));
    }

    formData.append('permanent', String(this.pubForm.permanent));

    // Images obligatoires (web et mobile)
    if (this.pubForm.image) {
      formData.append('webImg', this.pubForm.image, this.pubForm.imageName);
    }
    if (this.pubForm.mobileImage) {
      formData.append('mobileImg', this.pubForm.mobileImage, this.pubForm.mobileImageName);
    }

    this.publiciteService.addAd(formData).subscribe({
      next: () => {
        this.closeCreatePopup();
        this.resetForm();
        this.loadAds(); // Recharger la liste
        this.loadStats(); // Recharger les stats
        this.alertService.success(
          'Publicité créée avec succès',
          'light'
        );
        this.cdr.markForCheck();
      },
      error: (er) => {
        console.error('Erreur lors de la création de la publicité:', er);
        this.alertService.error(
          "Erreur lors de la création de la publicité",
          'light'
        );
        this.cdr.markForCheck();
      }
    });
  }

  /** Convertir une date yyyy-MM-dd (input HTML) vers dd-MM-yyyy (backend) */
  formatDateForBackend(dateStr: string): string {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  }

  resetForm() {
    this.pubForm = {
      titre: '',
      description: '',
      lien: '',
      dateDebut: '',
      dateFin: '',
      permanent: false,
      image: null,
      imageName: '',
      mobileImage: null,
      mobileImageName: ''
    };
  }

  /* ============================================================
   * ✏️ MODIFICATION (API PUT)
   * ============================================================ */
  showEditPopup = false;
  editPub: any = null;
  editWebImage: File | null = null;
  editMobileImage: File | null = null;
  editWebImagePreview: string | null = null;
  editMobileImagePreview: string | null = null;

  openEditPopup(pub: any) {
    this.editPub = {
      id: pub.id,
      title: pub.title || pub.titre,
      description: pub.description,
      link: pub.link || pub.lien || '',
      permanent: pub.permanent,
      webImg: pub.webImg || pub.image,
      mobileImg: pub.mobileImg,
      startDateInput: this.convertBackendDateToInput(pub.startDate),
      endDateInput: this.convertBackendDateToInput(pub.endDate)
    };

    this.editWebImage = null;
    this.editMobileImage = null;
    this.editWebImagePreview = null;
    this.editMobileImagePreview = null;
    this.showEditPopup = true;
  }

  closeEditPopup() {
    this.showEditPopup = false;
    this.editPub = null;
    this.editWebImage = null;
    this.editMobileImage = null;
    this.editWebImagePreview = null;
    this.editMobileImagePreview = null;
  }

  /** Convertir date backend (dd-MM-yyyy) vers format input (yyyy-MM-dd) */
  convertBackendDateToInput(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`; // dd-MM-yyyy → yyyy-MM-dd
    }
    return '';
  }

  onEditFileSelected(event: any, type: 'web' | 'mobile') {
    const file = event.target.files[0];
    if (!file) return;

    if (type === 'web') {
      this.editWebImage = file;
      // Prévisualisation
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editWebImagePreview = e.target.result;
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(file);
    } else {
      this.editMobileImage = file;
      // Prévisualisation
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editMobileImagePreview = e.target.result;
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(file);
    }
  }

  saveEditPub() {
    if (!this.editPub) return;

    const formData = new FormData();
    formData.append('title', this.editPub.title);
    formData.append('description', this.editPub.description);
    formData.append('link', this.editPub.link || '');
    formData.append('permanent', this.editPub.permanent.toString());

    // Dates - toujours envoyer si non permanent
    if (!this.editPub.permanent) {
      // Les dates sont obligatoires si non permanent
      const startDate = this.editPub.startDateInput ? this.formatDateForBackend(this.editPub.startDateInput) : '';
      const endDate = this.editPub.endDateInput ? this.formatDateForBackend(this.editPub.endDateInput) : '';

      if (startDate) {
        formData.append('startDate', startDate);
      }
      if (endDate) {
        formData.append('endDate', endDate);
      }
    } else {
      // Si permanent, envoyer des dates vides ou null
      formData.append('startDate', '');
      formData.append('endDate', '');
    }

    // Images - Le backend exige les images même en modification
    // Si nouvelles images sélectionnées, les utiliser
    if (this.editWebImage) {
      formData.append('webImg', this.editWebImage, this.editWebImage.name);
    } else if (this.editPub.webImg) {
      // Sinon, indiquer qu'on garde l'image existante
      formData.append('webImgName', this.editPub.webImg);
    }

    if (this.editMobileImage) {
      formData.append('mobileImg', this.editMobileImage, this.editMobileImage.name);
    } else if (this.editPub.mobileImg) {
      // Sinon, indiquer qu'on garde l'image existante
      formData.append('mobileImgName', this.editPub.mobileImg);
    }

    console.log('📤 Envoi modification publicité:', {
      id: this.editPub.id,
      title: this.editPub.title,
      permanent: this.editPub.permanent,
      startDateInput: this.editPub.startDateInput,
      endDateInput: this.editPub.endDateInput,
      startDateFormatted: !this.editPub.permanent && this.editPub.startDateInput ? this.formatDateForBackend(this.editPub.startDateInput) : null,
      endDateFormatted: !this.editPub.permanent && this.editPub.endDateInput ? this.formatDateForBackend(this.editPub.endDateInput) : null,
      hasNewWebImg: !!this.editWebImage,
      hasNewMobileImg: !!this.editMobileImage
    });

    this.publiciteService.updateAd(this.editPub.id, formData).subscribe({
      next: () => {
        this.loadAds();
        this.loadStats();
        this.closeEditPopup();
        this.cdr.markForCheck();

        this.alertService.success(
          'Publicité modifiée avec succès',
          'light'
        );
      },
      error: (err) => {
        console.error('❌ Erreur modification publicité:', err);
        console.error('Details:', err.error);
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
  openDeleteConfirmation(pub: any) {
    this.selectedPub = pub;

    this.alertService.confirm(
      `Êtes-vous sûr de vouloir supprimer la publicité "${pub.title}" ?`,
      'Supprimer',
      'light'
    ).then((confirmed) => {
      if (confirmed) {
        this.confirmDelete();
      }
    });
  }

  confirmDelete() {
    if (!this.selectedPub) return;

    this.publiciteService.deleteAd(this.selectedPub.id).subscribe({
      next: () => {
        this.loadAds(); // Recharger la liste
        this.loadStats(); // Recharger les stats
        this.cdr.markForCheck();

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
