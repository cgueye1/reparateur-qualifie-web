import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UserConnected, UpdateUserPayload } from '../../../models/user/userConnected';
import { MonCompteService } from '../../../core/service/pages/mon-compte/mon-compte-service.service';
import { SwettAlerteService } from '../../../core/service/alerte/swett-alerte.service';
import { PasswordChangeService } from '../../../core/service/auth/password-change/password-change.service';
import { PasswordChange } from '../../../models/auth/password-change/password-change';

@Component({
  selector: 'app-mon-compte',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mon-compte.component.html',
  styleUrl: './mon-compte.component.css',
})
export class MonCompteComponent implements OnInit {

  // ======================================================
  // 🔹 DONNÉES UTILISATEUR
  // ======================================================
  user!: UserConnected;
  loading = false;
  saving = false;

  // ======================================================
  // 🔹 POPUP CHANGEMENT DE MOT DE PASSE
  // ======================================================
  showPopupChangePassword = false;

  // Champs formulaire mot de passe
  email = '';
  password = '';
  newPassword = '';

  // Afficher / masquer mot de passe
  showPassword = false;

  constructor(
    private monCompteService: MonCompteService,
    private passwordChangeService: PasswordChangeService,
    private alert: SwettAlerteService
  ) {}

  // ======================================================
  // 🔹 INITIALISATION
  // ======================================================
  ngOnInit(): void {
    this.loadUser();
  }

  // ======================================================
  // 🔹 UTILISATEUR CONNECTÉ
  // ======================================================
  loadUser(): void {
    this.loading = true;

    this.monCompteService.getMonCompte().subscribe({
      next: (data) => {
        this.user = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement compte', err);
        this.loading = false;
      },
    });
  }

  // ======================================================
  // 🔹 MISE À JOUR DES INFOS DU COMPTE
  // ======================================================
  update(): void {
    if (!this.user) return;

    this.saving = true;

    const payload: UpdateUserPayload = {
      nom: this.user.nom,
      prenom: this.user.prenom,
      email: this.user.email,
      telephone: this.user.telephone,
      adress: this.user.adress,
      lat: this.user.lat,
      lon: this.user.lon,
      profil: this.user.profil,
    };

    this.monCompteService.updateMonCompte(this.user.id, payload).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.saving = false;
        this.alert.success('Compte mis à jour avec succès', 'light');
      },
      error: () => {
        this.saving = false;
        this.alert.error('Échec de la mise à jour du compte', 'light');
      },
    });
  }

  cancel(): void {
    window.history.back();
  }

  // ======================================================
  // 🔹 POPUP : CHANGEMENT DE MOT DE PASSE
  // ======================================================

  /** Ouvrir le popup */
  openPopupChangePassword(): void {
    this.showPopupChangePassword = true;

    // pré-remplir l’email si dispo
    if (this.user?.email) {
      this.email = this.user.email;
    }
  }

  /** Fermer le popup */
  closePopupChangePassword(): void {
    this.showPopupChangePassword = false;
    this.password = '';
    this.newPassword = '';
  }

  /** Afficher / cacher mot de passe */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // ======================================================
  // 🔹 CHANGEMENT DE MOT DE PASSE
  // ======================================================

  /** Récupérer l’ID utilisateur depuis le token JWT */
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

  /** Soumission du formulaire */
  onChangePassword(): void {

    // Sécurité front
    if (!this.email || !this.password || !this.newPassword) {
      this.alert.error('Tous les champs sont requis');
      return;
    }

    if (this.password.length < 4 || this.newPassword.length < 4) {
      this.alert.error('Mot de passe trop court');
      return;
    }

    const userId = this.getUserIdFromToken();
    if (!userId) {
      this.alert.error('Utilisateur non authentifié');
      return;
    }

    const data: PasswordChange = {
      email: this.email,
      password: this.password,
      newPassword: this.newPassword
    };

    this.passwordChangeService.changePassword(userId, data).subscribe({
      next: () => {
        this.alert.success('Mot de passe mis à jour avec succès','light');
        this.closePopupChangePassword();
      },
      error: () => {
        this.alert.error('Informations incorrectes');
      }
    });
  }
}
