import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../../core/service/auth/login/login.service';
import { LoginResponse } from '../../../models/auth/login-response/login-response';
import { SwettAlerteService } from '../../../core/service/alerte/swett-alerte.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private router = inject(Router);

  rememberMe = false;
  showPassword = false;

  email = "";
  password = "";

  constructor(
    private loginService: LoginService,
    private alert: SwettAlerteService,

  ) {}


  togglePassword() {
    this.showPassword = !this.showPassword;
  }


  onLogin() {

  const data = {
    email: this.email,
    password: this.password
  };

  this.loginService.login(data).subscribe({

    next: (res: LoginResponse) => {

      const authData = {
        accessToken: res.token,
        refreshToken: res.refreshToken
      };

      // ✅ Stockage du token
      localStorage.setItem('rq_auth', JSON.stringify(authData));

      // ❗ Si "se souvenir de moi" n’est PAS coché
      if (!this.rememberMe) {
        window.addEventListener('beforeunload', () => {
          localStorage.removeItem('rq_auth');
        });
      }

      // ✅ SweetAlert succès (discret)
      this.alert.success('Connexion réussie');

      // 🚀 Redirection après succès
      this.router.navigate(['/tableau-de-bord']);
    },

    error: () => {
      // ❌ SweetAlert erreur
      this.alert.error('Email ou mot de passe incorrect');
    }

  });
}

}
