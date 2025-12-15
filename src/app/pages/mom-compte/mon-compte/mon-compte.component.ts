import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UserConnected } from '../../../models/user/userConnected';
import { UpdateUserPayload } from '../../../models/user/userConnected';
import { MonCompteService } from '../../../core/service/mon-compte/mon-compte-service.service';
import Swal from 'sweetalert2';
import { SwettAlerteService } from '../../../core/service/alerte/swett-alerte.service';

@Component({
  selector: 'app-mon-compte',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mon-compte.component.html',
  styleUrl: './mon-compte.component.css'
})
export class MonCompteComponent implements OnInit {

  user!: UserConnected;
  loading = false;
  saving = false;

  constructor(
    private monCompteService: MonCompteService,
    private alert: SwettAlerteService


  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  /**
   * 🔐 Récupérer l’utilisateur connecté
   */
  loadUser() {
    this.loading = true;

    this.monCompteService.getMonCompte().subscribe({
      next: (data) => {
        this.user = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement compte', err);
        this.loading = false;
      }
    });
  }

  /**
   * ✏️ Mise à jour du compte utilisateur
   */
 update() {
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
    profil: this.user.profil
  };

  this.monCompteService.updateMonCompte(this.user.id, payload).subscribe({
    next: (updatedUser) => {
      this.user = updatedUser;
      this.saving = false;

      // ✅ Succès (THÈME CLAIR)
      this.alert.success(
        'Compte mis à jour avec succès',
        'light'
      );
    },
    error: () => {
      this.saving = false;

      // ❌ Erreur (THÈME CLAIR)
      this.alert.error(
        'Échec de la mise à jour du compte',
        'light'
      );
    }
  });
}



  cancel() {
    window.history.back();
  }
}
