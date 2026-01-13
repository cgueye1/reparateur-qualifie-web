import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';

import { UtilisateurService } from '../../../core/service/pages/utilisateurs/utilisateur.service';
import { SwettAlerteService } from '../../../core/service/alerte/swett-alerte.service';
import { User } from '../../../models/pages/utilisateurs/utilisateur';

@Component({
  selector: 'app-detail-client',
  standalone: true,
  imports: [CommonModule, NgIf, NgChartsModule],
  templateUrl: './detail-client.component.html',
  styleUrl: './detail-client.component.css'
})
export class DetailClientComponent implements OnInit {

  // =====================================================
  // 👤 CLIENT
  // =====================================================
  user: User | null = null;
  loading = false;

  // =====================================================
  // 🧭 ONGLET
  // =====================================================
  tab: string = localStorage.getItem('activeClientTab') || 'overview';

  changeTab(tab: string): void {
    this.tab = tab;
    localStorage.setItem('activeClientTab', tab);
  }

  // =====================================================
  // 🔵 POPUPS CONFIRMATION
  // =====================================================
  showActivatePopup = false;
  showDeactivatePopup = false;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private userService: UtilisateurService,
    private alertService: SwettAlerteService
  ) {}

  // =====================================================
  // 🔄 INIT
  // =====================================================
  ngOnInit(): void {
    this.loadClientDetail();
    this.initDonutChart();
    this.initLineChart();
  }

  // =====================================================
  // 📡 API — DÉTAIL CLIENT
  // =====================================================
  loadClientDetail(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    this.loading = true;

    this.userService.getUserById(id).subscribe({
      next: (res: User) => {
        this.user = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.alertService.error(
          "Erreur lors du chargement du détail du client",
          'light'
        );
      }
    });
  }

  // =====================================================
  // 🔁 ACTIVER / DÉSACTIVER (API)
  // =====================================================
  openActivatePopup(): void {
    this.showActivatePopup = true;
  }

  openDeactivatePopup(): void {
    this.showDeactivatePopup = true;
  }

  closeActivate(): void {
    this.showActivatePopup = false;
  }

  closeDeactivate(): void {
    this.showDeactivatePopup = false;
  }

  confirmActivate(): void {
    if (!this.user) return;

    this.userService.toggleActivation(this.user.id).subscribe({
      next: () => {
        this.user!.activated = true;
        this.showActivatePopup = false;

        this.alertService.success(
          'Compte client activé avec succès',
          'light'
        );
      },
      error: () => {
        this.alertService.error(
          "Impossible d’activer le compte client",
          'light'
        );
      }
    });
  }

  confirmDeactivate(): void {
    if (!this.user) return;

    this.userService.toggleActivation(this.user.id).subscribe({
      next: () => {
        this.user!.activated = false;
        this.showDeactivatePopup = false;

        this.alertService.success(
          'Compte client désactivé avec succès',
          'light'
        );
      },
      error: () => {
        this.alertService.error(
          "Impossible de désactiver le compte client",
          'light'
        );
      }
    });
  }

  // =====================================================
  // 🔙 NAVIGATION
  // =====================================================
  goBack(): void {
    this.location.back();
  }

  // =====================================================
  // 📌 TITRES SELON ONGLET
  // =====================================================
  get pageTitle(): string {
    switch (this.tab) {
      case 'overview': return 'Vue d’ensemble';
      case 'artisans': return 'Artisans ajoutés';
      case 'profils': return 'Profils partagés';
      case 'evaluations': return 'Évaluations';
      default: return '';
    }
  }

  // =====================================================
  // 👨‍🔧 ARTISANS AJOUTÉS (TEMPORAIRE / MOCK)
  // 👉 plus tard API
  // =====================================================
  artisansAjoutes = [
    { nom: 'Moussa Wade', metier: 'Plombier', tel: '77 000 00 00', date: '2025-01-15', statut: true },
    { nom: 'Lamine Niang', metier: 'Plombier', tel: '77 111 11 11', date: '2025-01-15', statut: false },
    { nom: 'Ousmane Diallo', metier: 'Menuisier', tel: '77 222 22 22', date: '2025-01-15', statut: true }
  ];

  // =====================================================
  // 🔁 PROFILS PARTAGÉS
  // =====================================================
  profilsPartages = [...this.artisansAjoutes];

  // =====================================================
  // 📊 DONUT CHART (AVIS)
  // =====================================================
  donutLabels = ['5 étoiles (50%)', '4 étoiles (15%)', '3 étoiles (30%)', '2 étoiles (5%)'];
  donutData: any;
  donutOptions: any;

  initDonutChart(): void {
    this.donutData = {
      labels: this.donutLabels,
      datasets: [{
        data: [50, 15, 30, 5],
        backgroundColor: ['#22C55F', '#F59E0C', '#3B83F6', '#EF4444'],
        borderWidth: 0
      }]
    };

    this.donutOptions = {
      cutout: '70%',
      plugins: { legend: { display: false } }
    };
  }

  // =====================================================
  // 📈 LINE CHART (VUES PROFIL)
  // =====================================================
  viewsData: any;
  viewsOptions: any;

  initLineChart(): void {
    this.viewsData = {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai'],
      datasets: [{
        label: 'Vues',
        data: [15, 12, 20, 10, 14],
        borderColor: '#E95F32',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#E95F32'
      }]
    };

    this.viewsOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: '#F1F1F1' } }
      }
    };
  }
}
