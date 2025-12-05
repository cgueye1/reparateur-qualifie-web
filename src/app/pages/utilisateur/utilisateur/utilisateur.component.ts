import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: 'app-utilisateur',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule, RouterModule],
  templateUrl: './utilisateur.component.html',
  styleUrl: './utilisateur.component.css'
})
export class UtilisateurComponent {
users = [
  {
    nom: "Moussa Wade",
    type: "Client",
    telephone: "77 000 00 00",
    metier: "",
    lastLogin: "2025-01-15",
    active: true,
    photo: "",
    initials: "MD"
  },
  {
    nom: "Lamine Niang",
    type: "Artisan",
    telephone: "77 111 11 11",
    metier: "Plombier",
    lastLogin: "2025-01-15",
    active: false,
    photo: "assets/users/lamine.png"
  },
  // ... ajoute les autres
];

searchTerm = "";
totalUsers = this.users.length;

// Filtrage recherche
get filteredUsers() {
  return this.users.filter(u =>
    u.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
}

toggleStatus(user: any) {
  this.selectedUser = user;

  if (user.active) {
    // User actif → on veut désactiver
    this.showDeactivatePopup = true;
  } else {
    // User inactif → on veut activer
    this.showActivatePopup = true;
  }
}




// ===============================
// 🔵 POPUPS ACTIVATION / DESACTIVATION
// ===============================

// État des popups
showActivatePopup: boolean = false;
showDeactivatePopup: boolean = false;

// Popups success
showSuccessActivate: boolean = false;
showSuccessDeactivate: boolean = false;

// utilisateur sélectionné
selectedUser: any = null;


// 👉 Ouvrir popup Activer
openActivatePopup(user: any) {
  this.selectedUser = user;
  this.showActivatePopup = true;
}

// 👉 Ouvrir popup Désactiver
openDeactivatePopup(user: any) {
  this.selectedUser = user;
  this.showDeactivatePopup = true;
}

// 👉 Fermer popup Activer
closeActivate() {
  this.showActivatePopup = false;
}

// 👉 Fermer popup Désactiver
closeDeactivate() {
  this.showDeactivatePopup = false;
}


// 👉 Confirmer ACTIVATION
confirmActivate() {
  if (this.selectedUser) {
    this.selectedUser.active = true; // met à jour le statut
  }

  this.showActivatePopup = false;
  this.showSuccessActivate = true;

  setTimeout(() => {
    this.showSuccessActivate = false;
  }, 1800);
}


// 👉 Confirmer DESACTIVATION
confirmDeactivate() {
  if (this.selectedUser) {
    this.selectedUser.active = false;
  }

  this.showDeactivatePopup = false;
  this.showSuccessDeactivate = true;

  setTimeout(() => {
    this.showSuccessDeactivate = false;
  }, 1800);
}


}
