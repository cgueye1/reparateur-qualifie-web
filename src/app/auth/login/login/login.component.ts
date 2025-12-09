import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../../core/service/auth/login/login.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  showPassword: boolean = false;

  email: string = "";
  password: string = "";

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
      next: (res) => {
        console.log("SUCCESS :", res);
        alert("Connexion réussie");
      },
      error: (err) => {
        console.log("ERROR :", err);
        alert("Identifiants incorrects");
      }
    });
  }

}
