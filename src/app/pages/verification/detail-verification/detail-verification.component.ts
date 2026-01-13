import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail-verification',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './detail-verification.component.html',
  styleUrls: ['./detail-verification.component.css']
})
export class DetailVerificationComponent implements OnInit {

  // données d'exemple — remplace par tes données réelles
  demande: any = {
    id: '1201010',
    nom: 'Ousmane DIALLO',
    profession: 'Artisan',
    metier: 'Menuisier',
    date: '15/11/2025 14:30',
    email: 'ousmane.diallo@gmail.com',
    telephone: '70 645 87 92',
    ville: 'Dakar - Médina',
    dateInscription: '11/10/2025',
    dateDemande: '15/11/2025 14:30',
    plan: 'Abonnement Mensuel',
    montant: '14 900F',
    statut: 'En attente', // En attente | Validée | Refusée
    photo: 'https://i.pravatar.cc/200',
    documents: [
      { nom: 'CNI', size: '209 ko', url: '#' },
      { nom: 'Certificat professionnel', size: '203 ko', url: '#' }
    ]
  };

  // propriétés utilisées par le template
  user: any = {};
  documents: any[] = [];
  tab: string = 'overview';
  pageTitle: string = 'Détails vérification';

  ngOnInit(): void {
    // initialise 'user' à partir de 'demande' (évite les erreurs de référence)
    this.user = {
      id: this.demande.id,
      nom: this.demande.nom,
      photo: this.demande.photo,
      initials: this.getInitials(this.demande.nom),
      metier: this.demande.metier,
      email: this.demande.email,
      telephone: this.demande.telephone,
      ville: this.demande.ville,
      dateInscription: this.demande.dateInscription,
      active: this.demande.statut === 'Validée'
    };

    // documents — soit dans demande.documents, soit tableau vide
    this.documents = Array.isArray(this.demande.documents) ? this.demande.documents : [];
  }

  // navigation
  goBack(): void {
    window.history.back();
  }


  // méthodes présentes dans certains snippets HTML précédents — incluses pour compatibilité
  openActivatePopup(user: any): void {
    console.log('open activate popup for', user?.id || user);
  }

  openDeactivatePopup(user: any): void {
    console.log('open deactivate popup for', user?.id || user);
  }

  // change d'onglet (utilisé si ton template a des onglets)
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

  // classes pour les statuts (utilisé avec [ngClass])
  statutClasses(statut: string): string {
    if (statut === 'Validée') {
      return 'bg-[#E6F5EC] text-[#008D36]';
    } else if (statut === 'Refusée' || statut === 'Refusé') {
      return 'bg-[#FFECEC] text-[#FF2828]';
    } else {
      return 'bg-gray-100 text-gray-600';
    }
  }











  // POPUPS
  showApproveConfirm = false;   // confirmer approbation
  showRejectForm = false;       // formulaire de rejet (motif)
  showSuccessApprove = false;   // message success approbation
  showSuccessReject = false;    // message success rejet
  showHistoryPopup = false;     // historique
  showDetailsPopup = false;     // (optionnel) aperçu

  // sélection
  selectedDemande: any = null;

  // champ motif pour le rejet
  rejectReason: string = '';

  // === open popups (appelés par les boutons Actions) ===
  openApprovePopup(demande: any) {
    this.selectedDemande = demande;
    this.showApproveConfirm = true;
  }

  openRejectPopup(demande: any) {
    this.selectedDemande = demande;
    this.rejectReason = '';
    this.showRejectForm = true;
  }

  openHistoryPopup(demande: any) {
    this.selectedDemande = demande;
    this.showHistoryPopup = true;
  }

  openDetailsPopup(demande: any) {
    this.selectedDemande = demande;
    this.showDetailsPopup = true;
  }

  // === close popups ===
  closeAllPopups() {
    this.showApproveConfirm = false;
    this.showRejectForm = false;
    this.showSuccessApprove = false;
    this.showSuccessReject = false;
    this.showHistoryPopup = false;
    this.showDetailsPopup = false;
  }

  // === confirmations (actions réelles) ===
  confirmApprove() {
    // ici tu peux appeler ton API pour valider la demande
    // simulation: fermer confirm -> afficher success
    this.showApproveConfirm = false;

    // mettre à jour statut local (si tu veux)
    if (this.selectedDemande) {
      this.selectedDemande.statut = 'Validée';
    }

    setTimeout(() => {
      this.showSuccessApprove = true;
      setTimeout(() => {
        this.showSuccessApprove = false;
      }, 1500);
    }, 200);
  }

  confirmReject() {
    // vérifier motif
    const reason = (this.rejectReason || '').trim();
    if (!reason) {
      // si tu veux ajouter un message d'erreur ici, fais-le — je garde simple
      return;
    }

    // simulation: fermer form -> success
    this.showRejectForm = false;

    if (this.selectedDemande) {
      this.selectedDemande.statut = 'Refusée';
      // possibilité : stocker reason dans selectedDemande.history
      this.selectedDemande.lastRejectReason = reason;
    }

    setTimeout(() => {
      this.showSuccessReject = true;
      setTimeout(() => {
        this.showSuccessReject = false;
      }, 1500);
    }, 200);
  }

  //
}


