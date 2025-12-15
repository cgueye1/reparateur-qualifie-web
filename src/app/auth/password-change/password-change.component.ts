import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

import { PasswordChangeService } from '../../core/service/auth/password-change/password-change.service';
import { PasswordChange } from '../../models/auth/password-change/password-change';
import { SwettAlerteService } from '../../core/service/alerte/swett-alerte.service';

@Component({
  selector: 'app-password-change',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './password-change.component.html',
  styleUrl: './password-change.component.css'
})
export class PasswordChangeComponent {

  // Champs du formulaire
  email = '';
  password = '';
  newPassword = '';

  // Affichage / masquage des mots de passe
  showPassword = false;

  constructor(
    private passwordChangeService: PasswordChangeService,
    private alert: SwettAlerteService
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Récupère l’ID utilisateur depuis le token JWT
   */
  getUserIdFromToken(): number | null {

    const auth =
      localStorage.getItem('rq_auth') ||
      sessionStorage.getItem('rq_auth');

    if (!auth) return null;

    try {
      const token = JSON.parse(auth).accessToken;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId;
    } catch {
      return null;
    }
  }

  /**
   * Soumission du formulaire de changement de mot de passe
   */
  onChangePassword() {

    // Sécurité frontend (champs vides)
    if (!this.email || !this.password || !this.newPassword) {
      return;
    }

    // Sécurité frontend (longueur minimale)
    if (this.password.length < 4 || this.newPassword.length < 4) {
      return;
    }

    const userId = this.getUserIdFromToken();

    // Utilisateur non connecté
    if (!userId) {
      this.alert.error('Utilisateur non authentifié');
      return;
    }

    const data: PasswordChange = {
      email: this.email,
      password: this.password,
      newPassword: this.newPassword
    };

    // Appel API
    this.passwordChangeService.changePassword(userId, data).subscribe({
      next: () => {
        this.alert.success('Mot de passe mis à jour');

        // Nettoyage des champs sensibles
        this.password = '';
        this.newPassword = '';
      },
      error: () => {
        this.alert.error('Informations incorrectes');
      }
    });
  }
}
