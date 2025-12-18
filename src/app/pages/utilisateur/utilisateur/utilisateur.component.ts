import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  User,
  UserProfileDistribution,
  UserStatsCounter,
} from '../../../models/pages/utilisateurs/utilisateur';
import { UtilisateurService } from '../../../core/service/pages/utilisateurs/utilisateur.service';
import { SwettAlerteService } from '../../../core/service/alerte/swett-alerte.service';

@Component({
  selector: 'app-utilisateur',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, RouterModule, FormsModule],
  templateUrl: './utilisateur.component.html',
  styleUrl: './utilisateur.component.css',
})
export class UtilisateurComponent implements OnInit {

  // =====================================================
// 📊 STATISTIQUES GLOBALES (CARTES)
// =====================================================
usersStatsCounter?: UserStatsCounter;




  // =====================================================
  // 📊 STATISTIQUES UTILISATEURS (CARTES)
  // =====================================================

  // Données brutes venant de l’API
  usersProfilesDistribution: UserProfileDistribution[] = [];

  artisanStats?: UserProfileDistribution;
  clientStats?: UserProfileDistribution;

  // =====================================================
  // 📌 DONNÉES PRINCIPALES
  // =====================================================
  users: User[] = []; // Liste brute venant de l’API
  loading: boolean = false; // Loader global

  // =====================================================
  // 🔍 RECHERCHE
  // =====================================================
  searchTerm: string = '';

  // =====================================================
  // 🎯 FILTRES
  // =====================================================
  // Statut
  selectedStatus: 'ALL' | 'ACTIVE' | 'INACTIVE' = 'ALL';

  // Type utilisateur
  selectedType: 'ALL' | 'ADMIN' | 'ARTISAN' | 'CLIENT' = 'ALL';

  // Labels affichés dans les dropdowns
  selectedStatusLabel: string = 'Tous les statuts';
  selectedTypeLabel: string = 'Tous les types';

  // États des dropdowns
  showStatusDropdown: boolean = false;
  showTypeDropdown: boolean = false;

  // =====================================================
  // 🔢 PAGINATION
  // =====================================================
  page: number = 0;
  size: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;

  // =====================================================
  // 🔵 POPUPS ACTIVATION / DÉSACTIVATION
  // =====================================================
  showActivatePopup: boolean = false;
  showDeactivatePopup: boolean = false;
  selectedUser: User | null = null;

  constructor(
    private utilisateurService: UtilisateurService,
    private alertService: SwettAlerteService
  ) {}

  // =====================================================
  // 🚀 INITIALISATION
  // =====================================================
  ngOnInit(): void {
    this.loadUsers();
    this.loadUsersProfilesDistribution(); // 📊 cartes statistiques
     this.loadUsersStatsCounter();        // Total / Actifs / Évolution
  }

  // =====================================================
  // 📥 CHARGEMENT DES UTILISATEURS (API)
  // =====================================================
  loadUsers(): void {
    this.loading = true;

    this.utilisateurService.getUsers(this.page, this.size).subscribe({
      next: (res) => {
        this.users = res.content;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement utilisateurs ❌', err);
        this.loading = false;

        this.alertService.error(
          "Une erreur s'est produite lors du chargement des utilisateurs",
          'light'
        );
      },
    });
  }

  // =====================================================
  // 🔍 RECHERCHE + FILTRES (COMBINÉS)
  // =====================================================
  get filteredUsers(): User[] {
    return this.users.filter((user) => {
      // 🔍 Recherche (nom, prénom, téléphone)
      const search = this.searchTerm.toLowerCase();
      const matchesSearch =
        `${user.nom} ${user.prenom}`.toLowerCase().includes(search) ||
        user.telephone?.toLowerCase().includes(search);

      // 🟢🔴 Filtre statut
      const matchesStatus =
        this.selectedStatus === 'ALL' ||
        (this.selectedStatus === 'ACTIVE' && user.activated) ||
        (this.selectedStatus === 'INACTIVE' && !user.activated);

      // 👤 Filtre type
      const matchesType =
        this.selectedType === 'ALL' || user.profil === this.selectedType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }

  // =====================================================
  // 🎛️ GESTION DES DROPDOWNS
  // =====================================================
  toggleStatusDropdown(): void {
    this.showStatusDropdown = !this.showStatusDropdown;
    this.showTypeDropdown = false;
  }

  toggleTypeDropdown(): void {
    this.showTypeDropdown = !this.showTypeDropdown;
    this.showStatusDropdown = false;
  }

  // =====================================================
  // 🎯 CHANGEMENT DES FILTRES
  // =====================================================
  setStatusFilter(status: 'ALL' | 'ACTIVE' | 'INACTIVE'): void {
    this.selectedStatus = status;
    this.page = 0;
  }

  setTypeFilter(type: 'ALL' | 'ADMIN' | 'ARTISAN' | 'CLIENT'): void {
    this.selectedType = type;
    this.page = 0;
  }

  // =====================================================
  // 🔒 ACTIVATION / DÉSACTIVATION UTILISATEUR
  // =====================================================
  toggleStatus(user: User): void {
    this.selectedUser = user;

    if (user.activated) {
      this.showDeactivatePopup = true;
    } else {
      this.showActivatePopup = true;
    }
  }

  closeActivate(): void {
    this.showActivatePopup = false;
    this.selectedUser = null;
  }

  closeDeactivate(): void {
    this.showDeactivatePopup = false;
    this.selectedUser = null;
  }

  // ✅ CONFIRMATION ACTIVATION
  confirmActivate(): void {
    if (!this.selectedUser) return;

    this.utilisateurService.toggleActivation(this.selectedUser.id).subscribe({
      next: () => {
        this.closeActivate();
        this.alertService.success('Utilisateur activé avec succès', 'light');
        this.loadUsers();
      },
      error: () => {
        this.alertService.error(
          "Une erreur s'est produite lors de l’activation",
          'light'
        );
      },
    });
  }

  // ❌ CONFIRMATION DÉSACTIVATION
  confirmDeactivate(): void {
    if (!this.selectedUser) return;

    this.utilisateurService.toggleActivation(this.selectedUser.id).subscribe({
      next: () => {
        this.closeDeactivate();
        this.alertService.success('Utilisateur désactivé avec succès', 'light');
        this.loadUsers();
      },
      error: () => {
        this.alertService.error(
          "Une erreur s'est produite lors de la désactivation",
          'light'
        );
      },
    });
  }

  // =====================================================
  // 🔢 PAGINATION
  // =====================================================
  nextPage(): void {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.loadUsers();
    }
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadUsers();
    }
  }

  onSizeChange(): void {
    this.page = 0;
    this.loadUsers();
  }

  // Texte pagination : "1 – 10 sur 40"
  get startIndex(): number {
    if (this.totalElements === 0) return 0;
    return this.page * this.size + 1;
  }

  get endIndex(): number {
    return Math.min((this.page + 1) * this.size, this.totalElements);
  }

  // =====================================================
  // 📊 CHARGEMENT DES STATISTIQUES UTILISATEURS
  // =====================================================
  loadUsersProfilesDistribution(): void {
    this.utilisateurService.getUsersProfilesDistribution().subscribe({
      next: (res) => {
        this.usersProfilesDistribution = res;

        // Séparation par profil (utile pour les cartes)

        this.artisanStats = res.find((p) => p.profile === 'ARTISAN');
        this.clientStats = res.find((p) => p.profile === 'CLIENT');
      },
      error: (err) => {
        console.error('Erreur chargement statistiques utilisateurs ❌', err);
      },
    });
  }


  // =====================================================
// 📊 CHARGEMENT DES STATS GLOBALES UTILISATEURS
// =====================================================
loadUsersStatsCounter(): void {

  this.utilisateurService.getUsersStatsCounter().subscribe({
    next: (res) => {
      this.usersStatsCounter = res;
    },
    error: (err) => {
      console.error('Erreur stats globales utilisateurs ❌', err);

      this.alertService.error(
        "Une erreur s'est produite lors du chargement des statistiques utilisateurs",
        'light'
      );
    }
  });

}

}
