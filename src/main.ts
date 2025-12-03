import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { Chart } from 'chart.js';

// 📌 Appliquer la police Geist à tous les graphiques
Chart.defaults.font.family = 'Geist, sans-serif';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
