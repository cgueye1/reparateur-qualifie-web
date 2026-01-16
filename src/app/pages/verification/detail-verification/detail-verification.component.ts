import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { VerificationService } from '../../../core/service/pages/verification/verification.service';
import { SwettAlerteService } from '../../../core/service/alerte/swett-alerte.service';
import { Verification, UserDocument } from '../../../models/pages/verification/verification';

@Component({
  selector: 'app-detail-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail-verification.component.html',
  styleUrls: ['./detail-verification.component.css']
})
export class DetailVerificationComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private verificationService: VerificationService,
    private alertService: SwettAlerteService
  ) { }

  /* ============================================================
   * 📌 DONNÉES PRINCIPALES (API)
   * ============================================================ */
  verification: Verification | null = null;
  loading = true;
  loadingDocuments = false;

  // Propriétés utilisées par le template (mappées depuis verification)
  demande: any = {};
  user: any = {};
  documents: { nom: string; taille: string; url: string; status: string }[] = [];

  tab: string = 'overview';
  pageTitle: string = 'Détails vérification';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    if (id) {
      this.loadVerification(id);
    } else {
      this.loading = false;
      this.alertService.error('ID de vérification invalide', 'light');
    }
  }

  /* ============================================================
   * 📡 CHARGEMENT DE LA VÉRIFICATION (PARTIE 1)
   * ============================================================ */
  loadVerification(id: number): void {
    this.loading = true;

    this.verificationService.getVerificationById(id).subscribe({
      next: (v) => {
        if (v) {
          this.verification = v;
          this.mapVerificationToTemplate(v);
        } else {
          this.alertService.error('Vérification non trouvée', 'light');
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.alertService.error('Erreur lors du chargement de la vérification', 'light');
      }
    });
  }

  /* ============================================================
   * 🔄 MAPPING VERS LE TEMPLATE (SANS MODIFIER LE DESIGN)
   * ============================================================ */
  private mapVerificationToTemplate(v: Verification): void {
    // Mapper vers 'demande' (utilisé par le template)
    this.demande = {
      id: v.id,
      nom: `${v.user.prenom} ${v.user.nom}`,
      profession: v.user.profil,
      metier: v.user.trade?.name || 'Non spécifié',
      date: this.formatDate(v.startDate),
      email: v.user.email,
      telephone: v.user.telephone || 'Non renseigné',
      ville: v.user.adress || 'Non renseignée',
      dateInscription: '-',
      dateDemande: this.formatDate(v.startDate),
      plan: v.badgePlan?.name || 'Non spécifié',
      montant: `${v.amountPaid?.toLocaleString('fr-FR') || 0} FCFA`,
      statut: this.mapStatus(v.status),
      photo: v.user.photo
    };

    // Mapper vers 'user' (utilisé par le template)
    this.user = {
      id: v.user.id,
      nom: `${v.user.prenom} ${v.user.nom}`,
      photo: v.user.photo,
      initials: this.getInitials(`${v.user.prenom} ${v.user.nom}`),
      metier: v.user.trade?.name || 'Non spécifié',
      email: v.user.email,
      telephone: v.user.telephone || 'Non renseigné',
      ville: v.user.adress || 'Non renseignée',
      dateInscription: '-',
      active: v.active
    };

    // Charger les documents utilisateur (PARTIE 2)
    this.loadUserDocuments(v.user.id);
  }

  /* ============================================================
   * 📄 CHARGEMENT DES DOCUMENTS UTILISATEUR (PARTIE 2)
   * ============================================================ */
  private loadUserDocuments(userId: number): void {
    this.loadingDocuments = true;
    this.documents = [];

    this.verificationService.getUserDocuments(userId).subscribe({
      next: (docs: UserDocument[]) => {
        // Mapper vers le format attendu par le template
        this.documents = docs.map(doc => ({
          nom: doc.name,
          taille: '—', // Taille non fournie par l'API
          url: doc.fileUrl,
          status: doc.status
        }));
        this.loadingDocuments = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des documents:', err);
        this.documents = [];
        this.loadingDocuments = false;
      }
    });
  }

  private mapStatus(status: string): string {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'VALIDATED': return 'Validée';
      case 'REJECTED': return 'Refusée';
      default: return status;
    }
  }

  private formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // navigation
  goBack(): void {
    window.history.back();
  }

  // change d'onglet
  changeTab(tabName: string): void {
    this.tab = tabName;
  }

  // utilitaire : récupère les initiales du nom
  private getInitials(name?: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  // classes pour les statuts
  statutClasses(statut: string): string {
    if (statut === 'Validée') {
      return 'bg-[#E6F5EC] text-[#008D36]';
    } else if (statut === 'Refusée' || statut === 'Refusé') {
      return 'bg-[#FFECEC] text-[#FF2828]';
    } else {
      return 'bg-gray-100 text-gray-600';
    }
  }

  /* ============================================================
   * 🔄 POPUPS APPROUVER / REJETER
   * ============================================================ */
  showApproveConfirm = false;
  showRejectForm = false;
  showSuccessApprove = false;
  showSuccessReject = false;

  rejectReason: string = '';

  openApprovePopup(demande: any): void {
    this.showApproveConfirm = true;
  }

  openRejectPopup(demande: any): void {
    this.rejectReason = '';
    this.showRejectForm = true;
  }

  closeAllPopups(): void {
    this.showApproveConfirm = false;
    this.showRejectForm = false;
    this.showSuccessApprove = false;
    this.showSuccessReject = false;
  }

  /* ============================================================
   * ✅ CONFIRMER APPROBATION (API - même logique que verification.component)
   * ============================================================ */
  confirmApprove(): void {
    if (!this.verification) return;

    this.verificationService.updateBadgeStatus(this.verification.id, true).subscribe({
      next: () => {
        this.verification!.active = true;
        this.verification!.status = 'VALIDATED';
        this.demande.statut = 'Validée';
        this.user.active = true;

        this.showApproveConfirm = false;
        this.showSuccessApprove = true;

        setTimeout(() => {
          this.showSuccessApprove = false;
        }, 2000);

        this.alertService.success('Vérification approuvée avec succès', 'light');
      },
      error: () => {
        this.closeAllPopups();
        this.alertService.error("Erreur lors de l'approbation", 'light');
      }
    });
  }

  /* ============================================================
   * ❌ CONFIRMER REJET (API - même logique que verification.component)
   * ============================================================ */
  confirmReject(): void {
    const reason = (this.rejectReason || '').trim();
    if (!reason) {
      this.alertService.error('Veuillez indiquer un motif de rejet', 'light');
      return;
    }

    if (!this.verification) return;

    this.verificationService.updateBadgeStatus(this.verification.id, false).subscribe({
      next: () => {
        this.verification!.active = false;
        this.verification!.status = 'REJECTED';
        this.demande.statut = 'Refusée';
        this.user.active = false;

        this.showRejectForm = false;
        this.showSuccessReject = true;

        setTimeout(() => {
          this.showSuccessReject = false;
        }, 2000);

        this.alertService.success('Vérification rejetée', 'light');
      },
      error: () => {
        this.closeAllPopups();
        this.alertService.error('Erreur lors du rejet', 'light');
      }
    });
  }
}


