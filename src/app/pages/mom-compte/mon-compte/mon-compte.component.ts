import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mon-compte',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './mon-compte.component.html',
  styleUrl: './mon-compte.component.css'
})
export class MonCompteComponent {
 user = {
    prenom: 'Moussa',
    nom: 'Ly',
    telephone: '77 000 00 00',
    email: 'mly@gmail.com',
    profil: 'Admin',
    initials: 'ML',
    photo: null // ou url d’une photo
  };

  update() {
    console.log("Update user →", this.user);
  }

  cancel() {
    window.history.back();
  }
}
