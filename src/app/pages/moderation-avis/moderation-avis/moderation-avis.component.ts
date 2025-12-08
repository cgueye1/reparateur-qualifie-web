import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
export class ModerationAvisComponent {

  // 📌 STATISTIQUES
  stats = {
    total: 8,
    attente: 5,
    resolus: 3
  };

  // 📌 LISTE DES AVIS SIGNALÉS
  avis = [
    {
      date: "25/11/2025",
      auteur: "Moussa Sow",
      raison: "Commentaire inapproprié",
      contenu: "Bon service, travail de qualité.",
      statut: "Signalé"
    },
    {
      date: "25/11/2025",
      auteur: "Moussa Sow",
      raison: "Commentaire inapproprié",
      contenu: "Bon service, travail de qualité.",
      statut: "Publié"
    },
    {
      date: "25/11/2025",
      auteur: "Moussa Sow",
      raison: "Commentaire inapproprié",
      contenu: "Bon service, travail de qualité.",
      statut: "Publié"
    }
  ];

  // 🔍 CHAMP RECHERCHE
  searchText: string = '';

  // 🔍 FILTRAGE DES AVIS
  get filteredAvis() {
    if (!this.searchText.trim()) return this.avis;

    return this.avis.filter(a =>
      a.auteur.toLowerCase().includes(this.searchText.toLowerCase()) ||
      a.contenu.toLowerCase().includes(this.searchText.toLowerCase()) ||
      a.raison.toLowerCase().includes(this.searchText.toLowerCase())
    );
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
  this.showApprovePopup = false;

  setTimeout(() => {
    this.showSuccessApprove = true;

    setTimeout(() => {
      this.showSuccessApprove = false;
    }, 1500);
  }, 300);
}

confirmMask() {
  this.showMaskPopup = false;

  setTimeout(() => {
    this.showSuccessMask = true;

    setTimeout(() => {
      this.showSuccessMask = false;
    }, 1500);
  }, 300);
}

confirmDelete() {
  this.showDeletePopup = false;

  setTimeout(() => {
    this.showSuccessDelete = true;

    setTimeout(() => {
      this.showSuccessDelete = false;
    }, 1500);
  }, 300);
}

}
