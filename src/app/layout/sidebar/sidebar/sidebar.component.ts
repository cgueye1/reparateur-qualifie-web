import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgIf, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {

  // 🔔 événement envoyé au parent
  @Output() logoutEvent = new EventEmitter<void>();

  // popup logout
  showLogoutPopup = false;

  // paramètres
  showParametres = false;

  // ==========================
  // LOGOUT
  // ==========================

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

    // 🔥 envoie l’event au parent
    this.logoutEvent.emit();
  }

  // ==========================
  // PARAMÈTRES
  // ==========================

  toggleParametres() {
    this.showParametres = !this.showParametres;
  }
}
