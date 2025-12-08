import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent {

  // stats (cartes en haut)
  stats = {
    total: 8,
    attente: 5,
    approuvees: 2,
    rejetees: 1
  };

  // données d'exemple (table)
  demandes = [
    {
      id: 1,
      demandeur: 'Ousmane DIALLO',
      profession: 'Menuisier',
      date: '25/11/2025',
      documents: ['CNI', 'Certificat professionnel'],
      paiement: 'Complet',
      statut: 'En attente' // En attente | Validée | Refusée
    },
    {
      id: 2,
      demandeur: 'Lamine Niang',
      profession: 'Plombier',
      date: '25/11/2025',
      documents: ['CNI', 'Certificat professionnel'],
      paiement: 'Complet',
      statut: 'Validée'
    },
    {
      id: 3,
      demandeur: 'Moussa Wade',
      profession: 'Plombier',
      date: '25/11/2025',
      documents: [],
      paiement: 'Incomplet',
      statut: 'Refusée'
    }
  ];

  // recherche
  searchText: string = '';

  get filteredDemandes() {
    const q = this.searchText.trim().toLowerCase();
    if (!q) return this.demandes;
    return this.demandes.filter(d =>
      d.demandeur.toLowerCase().includes(q) ||
      d.profession.toLowerCase().includes(q) ||
      (d.documents || []).join(' ').toLowerCase().includes(q) ||
      d.statut.toLowerCase().includes(q)
    );
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

  // méthode utilitaire pour appeler depuis les boutons actions (expliqué plus bas)
  onAction(action: string, demande: any) {
    // mapping : 'view' | 'approve' | 'reject' | 'history'
    if (action === 'view') this.openDetailsPopup(demande);
    if (action === 'approve') this.openApprovePopup(demande);
    if (action === 'reject') this.openRejectPopup(demande);
    if (action === 'history') this.openHistoryPopup(demande);
  }







}
