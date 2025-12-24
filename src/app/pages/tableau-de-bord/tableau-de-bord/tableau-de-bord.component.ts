import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { ChartConfiguration } from 'chart.js/auto';
import { NgChartsModule } from 'ng2-charts';
import { forkJoin } from 'rxjs';
import {
  BadgeStats,
  RatingStats,
  RevenueEvolution,
  TopTrade,
  UserProfileDistribution,
  UsersGrowth
} from '../../../models/pages/tableau-de-bord/tableau-de-bord';
import { UserStatsCounter } from '../../../models/pages/utilisateurs/utilisateur';
import { TableauDeBordService } from '../../../core/service/pages/tableau-de-bord/tableau-de-bord.service';

@Component({
  selector: 'app-tableau-de-bord',
  standalone: true,
  imports: [NgChartsModule, NgIf],
  templateUrl: './tableau-de-bord.component.html',
  styleUrl: './tableau-de-bord.component.css'
})
export class TableauDeBordComponent implements OnInit {

// =====================================================
// 🍩 GRAPH — RÉPARTITION UTILISATEURS (DONUT)
// =====================================================

// États UI
donutChartLoading = false;
donutChartReady = false;
donutChartError = false;

// Données brutes venant de l’API
usersProfilesDistribution: UserProfileDistribution[] = [];



  // =====================================================
// 📊 GRAPH — MÉTIERS LES PLUS DEMANDÉS
// =====================================================

jobsChartLoading = false;
jobsChartError = false;
jobsChartReady = false;

// Données brutes API
topTrades: TopTrade[] = [];



  // =====================================================
  // 🔄 ÉTAT GLOBAL
  // =====================================================
  loading = false;

  // =====================================================
  // 📊 CARTES STATISTIQUES
  // =====================================================
  badgeStats?: BadgeStats;
  ratingStats?: RatingStats;
  usersStats?: UserStatsCounter;

  // =====================================================
  // 📈 GRAPH — ÉVOLUTION UTILISATEURS
  // =====================================================
  usersChartLoading = false;
  usersChartReady = false;
  usersChartError = false;
  usersGrowth: UsersGrowth[] = [];

  userChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59,130,246,0.15)',
      fill: true,
      tension: 0.2,
      pointRadius: 4,
      pointHoverRadius: 5,
      pointBackgroundColor: '#FFFFFF',
      pointBorderColor: '#3B82F6',
      pointBorderWidth: 1
    }]
  };

  userChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            return value !== null && value !== undefined
              ? `${value} utilisateurs`
              : '0 utilisateurs';
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: '#E5E7EB', display: false },
        ticks: {
          font: { size: 11 },
          maxRotation: 0,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: 12
        }
      },
      y: {
        grid: { color: '#E5E7EB' },
        ticks: {
          stepSize: 5,
          font: { size: 11 }
        },
        beginAtZero: true
      }
    }
  };

  // =====================================================
  // 📈 GRAPH — REVENUS
  // =====================================================
  revenueChartLoading = false;
  revenueChartReady = false;
  revenueChartError = false;
  revenueEvolution: RevenueEvolution[] = [];

  revenueChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      borderColor: '#E85C2C',
      backgroundColor: 'rgba(232,92,44,0.12)',
      fill: true,
      tension: 0.2,
      pointRadius: 4,
      pointHoverRadius: 5,
      pointBackgroundColor: '#FFFFFF',
      pointBorderColor: '#E85C2C',
      pointBorderWidth: 1
    }]
  };

  revenueChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            return value !== null && value !== undefined
              ? `${value.toLocaleString('fr-FR')} CFA`
              : '0 CFA';
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: '#E5E7EB', display: false },
        ticks: {
          font: { size: 11 },
          maxRotation: 0,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: 12
        }
      },
      y: {
        grid: { color: '#E5E7EB' },
        ticks: {
          stepSize: 5000,
          font: { size: 11 },
          callback: (value) => {
            const numValue = Number(value);
            return !isNaN(numValue) ? `${numValue.toLocaleString('fr-FR')} CFA` : '';
          }
        },
        beginAtZero: true
      }
    }
  };

  // =====================================================
// 📊 GRAPH — MÉTIERS LES PLUS DEMANDÉS (DYNAMIQUE)
// =====================================================



// Données du graphique Métiers
jobsChartData: {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    barPercentage: number;
  }[];
} = {
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: '#EFBD8E',
      borderColor: '#EFBD8E',
      borderWidth: 1,
      barPercentage: 0.6,
    }
  ]
};

jobsChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      ticks: { maxRotation: 45, minRotation: 45 },
      grid: { display: false }
    },
    y: {
      grid: { color: '#E5E7EB' },
      ticks: { stepSize: 1 } // logique pour userCount
    }
  }
};


  // =====================================================
// 🍩 GRAPH — DONUT (RÉPARTITION UTILISATEURS)
// =====================================================

donutChartData: {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    hoverOffset: number;
    borderWidth: number;
  }[];
} = {
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: ['#EC6A3B', '#262626'],
      hoverOffset: 4,
      borderWidth: 0
    }
  ]
};


donutChartOptions = {
  responsive: true,
  cutout: '68%',
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.label ?? '';
          const value = context.parsed ?? 0;
          return `${label} : ${value}`;
        }
      }
    }
  }
};

  // =====================================================
  // 🔌 CONSTRUCTEUR
  // =====================================================
  constructor(private tableauDeBordService: TableauDeBordService) {}

  // =====================================================
  // 🚀 INIT
  // =====================================================
  ngOnInit(): void {
    this.loadAllDashboardData();
  }

  // =====================================================
  // 📊 CHARGEMENT OPTIMISÉ DE TOUTES LES DONNÉES
  // =====================================================
  loadAllDashboardData(): void {
    this.loading = true;

    // 🔥 Chargement parallèle des stats
    forkJoin({
      badges: this.tableauDeBordService.getActiveBadgesStats(),
      ratings: this.tableauDeBordService.getRatingsStats(),
      users: this.tableauDeBordService.getUsersStats()
    }).subscribe({
      next: (res) => {
        this.badgeStats = res.badges;
        this.ratingStats = res.ratings;
        this.usersStats = res.users;
      },
      error: (err) => {
        console.error('❌ Erreur chargement stats:', err);
      },
      complete: () => {
        this.loading = false;
      }
    });

    // 📈 Chargement des graphiques
    this.loadUsersGrowthChart();
    this.loadRevenueEvolutionChart();
    this.loadTopTrades();
    this.loadUsersProfilesDonut();

  }

  // =====================================================
  // 📈 CHARGEMENT GRAPHIQUE UTILISATEURS
  // =====================================================
  loadUsersGrowthChart(): void {
    this.usersChartLoading = true;
    this.usersChartError = false;
    this.usersChartReady = false;

    this.tableauDeBordService.getUsersGrowth('ANNUEL').subscribe({
      next: (res) => {
        if (!res || res.length === 0) {
          this.usersChartError = true;
          return;
        }

        this.usersGrowth = res;

        // 🔁 Conversion mois anglais → français (abrégés)
        const monthMap: Record<string, string> = {
          January: 'Janv', February: 'Févr', March: 'Mars',
          April: 'Avr', May: 'Mai', June: 'Juin',
          July: 'Juil', August: 'Août', September: 'Sept',
          October: 'Oct', November: 'Nov', December: 'Déc'
        };

        this.userChartData.labels = res.map(
          item => monthMap[item.label] ?? item.label
        );
        this.userChartData.datasets[0].data = res.map(i => i.count);
        this.usersChartReady = true;
      },
      error: (err) => {
        console.error('❌ Erreur évolution utilisateurs:', err);
        this.usersChartError = true;
      },
      complete: () => {
        this.usersChartLoading = false;
      }
    });
  }

  // =====================================================
  // 💰 CHARGEMENT GRAPHIQUE REVENUS
  // =====================================================
  loadRevenueEvolutionChart(): void {
    this.revenueChartLoading = true;
    this.revenueChartError = false;
    this.revenueChartReady = false;

    this.tableauDeBordService.getRevenueEvolution().subscribe({
      next: (res) => {
        if (!res || res.length === 0) {
          this.revenueChartError = true;
          return;
        }

        this.revenueEvolution = res;

        // 🔁 Conversion mois anglais → français
        const monthMap: Record<string, string> = {
          January: 'Janv', February: 'Févr', March: 'Mars',
          April: 'Avr', May: 'Mai', June: 'Juin',
          July: 'Juil', August: 'Août', September: 'Sept',
          October: 'Oct', November: 'Nov', December: 'Déc'
        };

        this.revenueChartData.labels = res.map(
          item => monthMap[item.label] ?? item.label
        );
        this.revenueChartData.datasets[0].data = res.map(item => item.value);
        this.revenueChartReady = true;
      },
      error: (err) => {
        console.error('❌ Erreur chargement revenus:', err);
        this.revenueChartError = true;
      },
      complete: () => {
        this.revenueChartLoading = false;
      }
    });
  }

  // =====================================================
  // 🔄 MÉTHODES DE RECHARGEMENT
  // =====================================================
  retryUsersChart(): void {
    this.loadUsersGrowthChart();
  }

  retryRevenueChart(): void {
    this.loadRevenueEvolutionChart();
  }




// =====================================================
// 📊 CHARGEMENT TOP DES MÉTIERS
// =====================================================
loadTopTrades(): void {
  this.jobsChartLoading = true;
  this.jobsChartError = false;
  this.jobsChartReady = false;

  this.tableauDeBordService.getTopTrades().subscribe({
    next: (res) => {
      if (!res || res.length === 0) {
        this.jobsChartError = true;
        return;
      }

      this.topTrades = res;

      // Labels = noms des métiers
      this.jobsChartData.labels = res.map(
        trade => trade.tradeName
      );

      // Données = nombre d'utilisateurs / demandes
      this.jobsChartData.datasets[0].data = res.map(
        trade => trade.userCount
      );

      this.jobsChartReady = true;
    },
    error: (err) => {
      console.error('❌ Erreur chargement top métiers:', err);
      this.jobsChartError = true;
    },
    complete: () => {
      this.jobsChartLoading = false;
    }
  });
}


// =====================================================
// 🔄 RECHARGEMENT GRAPH MÉTIERS
// =====================================================
retryJobsChart(): void {
  this.loadTopTrades();
}


// =====================================================
// 🍩 GRAPH — RÉPARTITION UTILISATEURS (DONUT)
// =====================================================

// Valeurs affichées dans le donut
totalUsers = 0;
clientPercentage = 0;
artisanPercentage = 0;

// =====================================================
// 🍩 CHARGEMENT RÉPARTITION UTILISATEURS
// =====================================================
loadUsersProfilesDonut(): void {
  this.donutChartLoading = true;
  this.donutChartError = false;
  this.donutChartReady = false;

  this.tableauDeBordService.getUsersProfilesDistribution().subscribe({
    next: (res) => {
      if (!res || res.length === 0) {
        this.donutChartError = true;
        return;
      }

      this.usersProfilesDistribution = res;

      // -----------------------------
      // 📊 Données du graphique
      // -----------------------------

      // Labels (CLIENT / ARTISAN)
      this.donutChartData.labels = res.map(
        item => item.profile === 'CLIENT' ? 'Clients' : 'Artisans'
      );

      // Valeurs (counts)
      this.donutChartData.datasets[0].data = res.map(
        item => item.count
      );

      // -----------------------------
      // 🔢 Données affichées (texte)
      // -----------------------------

      // Total utilisateurs
      this.totalUsers = res.reduce(
        (sum, item) => sum + item.count, 0
      );

      // Pourcentages
      this.clientPercentage = Math.round(
        res.find(i => i.profile === 'CLIENT')?.percentage ?? 0
      );

      this.artisanPercentage = Math.round(
        res.find(i => i.profile === 'ARTISAN')?.percentage ?? 0
      );

      this.donutChartReady = true;
    },
    error: (err) => {
      console.error('❌ Erreur chargement donut utilisateurs:', err);
      this.donutChartError = true;
    },
    complete: () => {
      this.donutChartLoading = false;
    }
  });
}

// =====================================================
// 🔄 RECHARGEMENT DONUT UTILISATEURS
// =====================================================
retryDonutChart(): void {
  this.loadUsersProfilesDonut();
}


}
