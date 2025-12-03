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

// Toggle statut
toggleStatus(user: any) {
  user.active = !user.active;
}


}
