import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../../core/service/auth/login/login.service';
import { LoginResponse } from '../../../models/auth/login-response/login-response';

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

  constructor(private loginService: LoginService) {}


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

        // ✅ On stocke toujours dans localStorage
        localStorage.setItem("rq_auth", JSON.stringify(authData));

        // ❗ Si l'utilisateur ne veut pas rester connecté :
        // on supprime les tokens quand il quitte le navigateur
        if (!this.rememberMe) {
          window.addEventListener("beforeunload", () => {
            localStorage.removeItem("rq_auth");
          });
        }

        console.log("SUCCESS :", res);
        alert("Connexion réussie");

        // 🚀 Redirection
        this.router.navigate(['/tableau-de-bord']);
      },

      error: (err) => {
        console.log("ERROR :", err);
        alert("Identifiants incorrects");
      }
    });
  }
}
