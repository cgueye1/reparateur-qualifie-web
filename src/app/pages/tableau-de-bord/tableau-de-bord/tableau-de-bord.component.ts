import { Chart, ChartConfiguration } from 'chart.js/auto';
import { Component } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-tableau-de-bord',
  standalone: true,
  imports: [NgChartsModule,],
  templateUrl: './tableau-de-bord.component.html',
  styleUrl: './tableau-de-bord.component.css'
})
export class TableauDeBordComponent {


// 📌 Labels (mois)
  userChartLabels: string[] = ['Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];

  // 📌 Données du graphique
  userChartData: ChartConfiguration<'line'>['data'] = {
    labels: this.userChartLabels,
    datasets: [
      {
        data: [0, 7, 12, 20, 15, 25],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59,130,246,0.15)',
        fill: true,
        tension: 0.1,       // ligne droite comme dans Figma
        pointRadius: 4,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#3B82F6',
      }
    ]
  };

  // 📌 Options du graphique
  userChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: { display: false }
    },

    scales: {
      x: {
        grid: { color: '#E5E7EB' }
      },
      y: {
        grid: { color: '#E5E7EB' },
        ticks: { stepSize: 5 }
      }
    }
  };




//-------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------





// 📌 Labels
revenueChartLabels: string[] = ['Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];

// 📌 Données du graphique Revenus
revenueChartData: ChartConfiguration<'line'>['data'] = {
  labels: this.revenueChartLabels,
  datasets: [
    {
      data: [0, 5, 10, 20, 15, 25],
      borderColor: '#E85C2C',
      backgroundColor: 'rgba(232,92,44,0.12)',
      fill: true,
      tension: 0.1,  // 🔥 ligne droite comme Figma
      pointRadius: 4,
      pointBackgroundColor: '#FFFFFF',
      pointBorderColor: '#E85C2C',

    }
  ]
};

// 📌 Options du graphique Revenus
revenueChartOptions: ChartConfiguration<'line'>['options'] = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: { display: false }
  },

  scales: {
    x: {
      grid: { color: '#E5E7EB' }
    },
    y: {
      grid: { color: '#E5E7EB' },
      ticks: { stepSize: 5 }
    }
  }
};












//-------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------

jobsChartData = {
  labels: [
    'Plombier','Peintre','Électricien','Carreleur','Traiteurs',
    'Poseur de rideau','Couturier','Spécialiste TV','Voitures','Cuisiniers'
  ],
  datasets: [{
    data: [45, 42, 36, 29, 15, 10, 8, 6, 3, 1],
    backgroundColor: '#EFBD8E',
    borderColor: '#EFBD8E',
    borderWidth: 1,
    barPercentage: 0.6,
  }]
};

jobsChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    x: {
      ticks: { maxRotation: 45, minRotation: 45 },
      grid: { display: false }
    },
    y: {
      grid: { color: '#E5E7EB' },
      ticks: { stepSize: 10 }
    }
  }
};




//-------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
donutChartData = {
  labels: ['Client', 'Artisan'],
  datasets: [{
    data: [28, 14], // ORANGE = grande part, NOIR = petite part
    backgroundColor: ['#EC6A3B', '#262626'],
    hoverOffset: 4,
    borderWidth: 0
  }]
};


donutChartOptions = {
  responsive: true,
  cutout: '68%',  // trou intérieur (comme Figma)
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true }
  }
};



}
