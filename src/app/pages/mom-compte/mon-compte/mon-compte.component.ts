import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UserConnected, UpdateUserPayload } from '../../../models/user/userConnected';
import { MonCompteService } from '../../../core/service/pages/mon-compte/mon-compte-service.service';
import { SwettAlerteService } from '../../../core/service/alerte/swett-alerte.service';
import { PasswordChangeService } from '../../../core/service/auth/password-change/password-change.service';
import { PasswordChange } from '../../../models/auth/password-change/password-change';
import { environment } from '../../../../environments/environments';
import { UserStateService } from '../../../core/service/user-state.service';

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
  user: UserConnected | null = null;
  loading = false;
  saving = false;

  // ======================================================
  // 🔹 PHOTO DE PROFIL
  // ======================================================
  photoFile: File | null = null;
  photoPreview: string | null = null;

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
    private alert: SwettAlerteService,
    private userStateService: UserStateService
  ) { }

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
        if (data.photo) {
          this.photoPreview = this.getPhotoUrl(data.photo);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement compte', err);
        this.loading = false;
      },
    });
  }

  // ======================================================
  // 🔹 GESTION PHOTO DE PROFIL
  // ======================================================

  /**
   * Construire l'URL complète de la photo de profil
   * @param photo nom du fichier photo retourné par l'API
   * @returns URL complète ou placeholder
   */
  getPhotoUrl(photo: string | null | undefined): string {
    if (!photo) return '';
    if (photo.startsWith('http')) return photo;
    return `${environment.imageUrl}/${photo}`;
  }

  /**
   * Gestionnaire de sélection de photo
   * @param event Événement input file
   */
  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];

    // Validation type
    if (!file.type.startsWith('image/')) {
      this.alert.error('Veuillez sélectionner une image', 'light');
      return;
    }

    // Validation taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.alert.error('L\'image ne doit pas dépasser 5MB', 'light');
      return;
    }

    this.photoFile = file;

    // Créer un aperçu
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.photoPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  // ======================================================
  // 🔹 MISE À JOUR DES INFOS DU COMPTE
  // ======================================================
  update(): void {
    if (!this.user) return;

    this.saving = true;

    // Utiliser FormData pour supporter l'upload de photo
    const formData = new FormData();
    formData.append('nom', this.user.nom);
    formData.append('prenom', this.user.prenom);
    formData.append('email', this.user.email);
    formData.append('telephone', this.user.telephone);
    formData.append('adress', this.user.adress);
    formData.append('lat', this.user.lat.toString());
    formData.append('lon', this.user.lon.toString());
    formData.append('profil', this.user.profil);

    // Ajouter la photo si un nouveau fichier a été sélectionné
    if (this.photoFile) {
      formData.append('photo', this.photoFile, this.photoFile.name);
    }

    this.monCompteService.updateMonCompte(this.user.id, formData).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        if (updatedUser.photo) {
          this.photoPreview = this.getPhotoUrl(updatedUser.photo);
        }
        this.photoFile = null;
        this.saving = false;

        // Mettre à jour l'état global pour synchroniser le topbar
        this.userStateService.setUser(updatedUser);

        this.alert.success('Compte mis à jour avec succès', 'light');
      },
      error: (err) => {
        console.error('❌ Erreur complète:', err);
        console.error('❌ Message d\'erreur:', err.error);
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
    if (this.user && this.user.email) {
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
        this.alert.success('Mot de passe mis à jour avec succès', 'light');
        this.closePopupChangePassword();
      },
      error: () => {
        this.alert.error('Informations incorrectes');
      }
    });
  }
}
