import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { PasswordResetService } from '../../../core/service/auth/password-reset/password-reset.service';
import { SwettAlerteService } from '../../../core/service/alerte/swett-alerte.service';
import { PasswordReset } from '../../../models/auth/password-reset/password-reset';
import { Router } from '@angular/router';


@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.css'
})
export class PasswordResetComponent {
private router = inject(Router);
  // Champ email du formulaire
  email = '';

  constructor(
    private passwordResetService: PasswordResetService,
    private alert: SwettAlerteService
  ) {}

  /**
   * Envoi de la demande de réinitialisation du mot de passe
   */
  onResetPassword() {

  if (!this.email) {
    return;
  }

  const data: PasswordReset = {
    email: this.email
  };

  this.passwordResetService.resetPassword(data).subscribe({

    next: () => {
      // Cas idéal : backend retourne 200
      this.alert.success(
        `Un e-mail de réinitialisation a été envoyé à ${this.email}.`


      );
       this.router.navigate(['/auth/login']);
      this.email = '';

    },

   error: (err) => {

  // 🔍 Affichage COMPLET de l’erreur dans la console
  console.error('PASSWORD RESET ERROR 👉', err);

  // Pour voir précisément ce que le backend renvoie
  console.log('Status :', err.status);
  console.log('Body :', err.error);

  this.alert.error(
    'Erreur détectée (voir la console)'
  );
}


  });
}

}
