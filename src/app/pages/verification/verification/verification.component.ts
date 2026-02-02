import { Component, OnInit, OnDestroy, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { VerificationService } from '../../../core/service/pages/verification/verification.service';
import { SwettAlerteService } from '../../../core/service/alerte/swett-alerte.service';
import { Verification, UserDocument } from '../../../models/pages/verification/verification';
import { Page } from '../../../models/pages/plan-d\'abonnement/plan-abonnement';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './verification.component.html',
  styleUrl: './verification.component.css',
})
export class VerificationComponent implements OnInit, OnDestroy {
  // DestroyRef for unsubscribe
  private destroyRef = inject(DestroyRef);

  constructor(
    private verificationService: VerificationService,
    private alertService: SwettAlerteService
  ) { }

  /* ============================================================
   * 📌 DONNÉES PRINCIPALES
   * ============================================================ */
  verifications: Verification[] = [];
  loading = false;
  userDocuments: Map<number, UserDocument[]> = new Map();

  /* ============================================================
   * 📊 STATISTIQUES (KPIs)
   * ============================================================ */
  stats = {
    total: 0,
    pending: 0,
    validated: 0,
    rejected: 0
  };

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
    this.loadBadgeKpis();
    this.loadVerifications();
  }

  ngOnDestroy(): void {
    // Cleanup handled by DestroyRef
  }

  /* ============================================================
   * 📊 CHARGEMENT DES KPIs
   * ============================================================ */
  private loadBadgeKpis(): void {
    this.verificationService.getAdminKpis().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des statistiques:', err);
        // En cas d'erreur, on garde des valeurs sûres
        this.stats = {
          total: 0,
          pending: 0,
          validated: 0,
          rejected: 0,
        };
      }
    });
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
          this.loadDocumentsForUsers(res.content);
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
   * 📄 CHARGEMENT DES DOCUMENTS UTILISATEURS
   * ============================================================ */
  private loadDocumentsForUsers(verifications: Verification[]): void {
    if (verifications.length === 0) {
      this.loading = false;
      return;
    }

    // Créer un tableau d'observables pour charger les documents de chaque utilisateur
    const documentRequests = verifications.map(v =>
      this.verificationService.getUserDocuments(v.user.id).pipe(
        catchError(() => of([]))
      )
    );

    // Charger tous les documents en parallèle
    forkJoin(documentRequests).subscribe({
      next: (allDocs: UserDocument[][]) => {
        // Stocker les documents dans le Map par userId
        verifications.forEach((v, index) => {
          this.userDocuments.set(v.user.id, allDocs[index]);
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  /* ============================================================
   * 📄 OBTENIR LES NOMS DES DOCUMENTS D'UN UTILISATEUR
   * ============================================================ */
  getDocumentNames(userId: number): string {
    const docs = this.userDocuments.get(userId);
    if (!docs || docs.length === 0) {
      return '—';
    }
    return docs.map(d => d.name).join(', ');
  }

  getDocumentCount(userId: number): number {
    const docs = this.userDocuments.get(userId);
    return docs ? docs.length : 0;
  }

  /* ============================================================
   * � FILTRAGE LOCAL (RECHERCHE + PROFIL)
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
    if (!this.selectedVerification) return;

    this.verificationService.updateBadgeStatus(this.selectedVerification.id, true).subscribe({
      next: () => {
        if (this.selectedVerification) {
          this.selectedVerification.active = true;
        }
        this.closePopups();
        this.alertService.success('Vérification activée avec succès', 'light');
        this.loadVerifications(); // Recharger la liste
        this.loadBadgeKpis();     // Recharger les KPIs à partir de l'API
      },
      error: () => {
        this.closePopups();
        this.alertService.error("Erreur lors de l'activation de la vérification", 'light');
      }
    });
  }

  confirmDeactivate() {
    if (!this.selectedVerification) return;

    this.verificationService.updateBadgeStatus(this.selectedVerification.id, false).subscribe({
      next: () => {
        if (this.selectedVerification) {
          this.selectedVerification.active = false;
        }
        this.closePopups();
        this.alertService.success('Vérification désactivée avec succès', 'light');
        this.loadVerifications(); // Recharger la liste
        this.loadBadgeKpis();     // Recharger les KPIs à partir de l'API
      },
      error: () => {
        this.closePopups();
        this.alertService.error("Erreur lors de la désactivation de la vérification", 'light');
      }
    });
  }
}
