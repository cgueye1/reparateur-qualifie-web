import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VerificationService } from '../../../core/service/pages/verification/verification.service';
import { SwettAlerteService } from '../../../core/service/alerte/swett-alerte.service';
import { Verification } from '../../../models/pages/verification/verification';
import { Page } from '../../../models/pages/plan-d\'abonnement/plan-abonnement';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './verification.component.html',
  styleUrl: './verification.component.css',
})
export class VerificationComponent implements OnInit {

  constructor(
    private verificationService: VerificationService,
    private alertService: SwettAlerteService
  ) {}

  /* ============================================================
   * 📌 DONNÉES PRINCIPALES
   * ============================================================ */
  verifications: Verification[] = [];
  loading = false;

  /* ============================================================
   * 🔢 PAGINATION (API)
   * ============================================================ */
  page = 0;              // page courante (backend commence à 0)
  size = 10;             // éléments par page
  totalPages = 0;
  totalElements = 0;

  /* ============================================================
   * 🔍 RECHERCHE
   * ============================================================ */
  searchTerm: string = '';

  /* ============================================================
   * 🧩 FILTRES
   * ============================================================ */

  // 🔹 Filtre STATUT (API)
  statusFilter: 'ALL' | 'PENDING' | 'VALIDATED' | 'REJECTED' = 'ALL';
  showStatusDropdown = false;
  selectedStatusLabel = 'Tous les statuts';

  // 🔹 Filtre PROFIL (LOCAL)
  typeFilter: 'ALL' | 'ADMIN' | 'ARTISAN' | 'CLIENT' = 'ALL';
  showTypeDropdown = false;
  selectedTypeLabel = 'Tous les profils';

  /* ============================================================
   * 🚀 INITIALISATION
   * ============================================================ */
  ngOnInit(): void {
    this.loadVerifications();
  }

  /* ============================================================
   * 📡 CHARGEMENT DES VÉRIFICATIONS (API)
   * ============================================================ */
  loadVerifications() {
    this.loading = true;

    this.verificationService
      .getVerifications(
        this.statusFilter === 'ALL' ? undefined : this.statusFilter,
        this.page,
        this.size
      )
      .subscribe({
        next: (res: Page<Verification>) => {
          this.verifications = res.content;
          this.totalPages = res.totalPages;
          this.totalElements = res.totalElements;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.alertService.error(
            'Erreur lors du chargement des vérifications',
            'light'
          );
        },
      });
  }

  /* ============================================================
   * 🔍 FILTRAGE LOCAL (RECHERCHE + PROFIL)
   * ============================================================ */
  get filteredVerifications(): Verification[] {
    let data = [...this.verifications];

    // 🔎 Recherche par nom / prénom
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      data = data.filter(v =>
        v.user.nom.toLowerCase().includes(term) ||
        v.user.prenom.toLowerCase().includes(term)
      );
    }

    // 🧩 Filtre profil (local)
    if (this.typeFilter !== 'ALL') {
      data = data.filter(v => v.user.profil === this.typeFilter);
    }

    return data;
  }

  /* ============================================================
   * 🔢 PAGINATION (ACTIONS)
   * ============================================================ */
  nextPage() {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.loadVerifications();
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.loadVerifications();
    }
  }

  onSizeChange() {
    this.page = 0;
    this.loadVerifications();
  }

  /* ============================================================
   * 🔢 PAGINATION (AFFICHAGE)
   * ============================================================ */
  get startIndex(): number {
    return this.page * this.size + 1;
  }

  get endIndex(): number {
    return Math.min((this.page + 1) * this.size, this.totalElements);
  }

  /* ============================================================
   * 🧩 FILTRE STATUT (API)
   * ============================================================ */
  toggleStatusDropdown() {
    this.showStatusDropdown = !this.showStatusDropdown;
  }

  setStatusFilter(
    status: 'ALL' | 'PENDING' | 'VALIDATED' | 'REJECTED',
    label: string
  ) {
    this.statusFilter = status;
    this.selectedStatusLabel = label;
    this.showStatusDropdown = false;
    this.page = 0;
    this.loadVerifications();
  }

  /* ============================================================
   * 🧩 FILTRE PROFIL (LOCAL)
   * ============================================================ */
  toggleTypeDropdown() {
    this.showTypeDropdown = !this.showTypeDropdown;
  }

  setTypeFilter(
    type: 'ALL' | 'ADMIN' | 'ARTISAN' | 'CLIENT',
    label: string
  ) {
    this.typeFilter = type;
    this.selectedTypeLabel = label;
    this.showTypeDropdown = false;
  }

  /* ============================================================
   * 🔄 ACTIVATION / DÉSACTIVATION (SIMULATION)
   * ============================================================ */
  showActivatePopup = false;
  showDeactivatePopup = false;

  selectedVerification: Verification | null = null;

  openActivatePopup(v: Verification) {
    this.selectedVerification = v;
    this.showActivatePopup = true;
  }

  openDeactivatePopup(v: Verification) {
    this.selectedVerification = v;
    this.showDeactivatePopup = true;
  }

  closePopups() {
    this.showActivatePopup = false;
    this.showDeactivatePopup = false;
    this.selectedVerification = null;
  }

  confirmActivate() {
    if (this.selectedVerification) {
      this.selectedVerification.active = true;
    }

    this.closePopups();

    this.alertService.success(
      'Vérification activée avec succès',
      'light'
    );
  }

  confirmDeactivate() {
    if (this.selectedVerification) {
      this.selectedVerification.active = false;
    }

    this.closePopups();

    this.alertService.success(
      'Vérification désactivée avec succès',
      'light'
    );
  }
}
