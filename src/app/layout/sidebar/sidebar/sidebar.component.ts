
import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgIf,RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  showLogoutPopup = false;

// ouvrir la popup
openLogoutPopup() {
  this.showLogoutPopup = true;
}

// fermer la popup
closeLogoutPopup() {
  this.showLogoutPopup = false;
}

// confirmer la déconnexion
confirmLogout() {
  this.showLogoutPopup = false;

  // 👉 ici plus tard tu pourras appeler ton service logout
  // pour l’instant on simule le retour vers login
  window.location.href = '/auth/login';
}

showParametres = false;

toggleParametres() {
  this.showParametres = !this.showParametres;
}

}
