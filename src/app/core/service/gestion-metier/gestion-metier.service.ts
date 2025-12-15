// src/app/core/service/gestion-metier/gestion-metier.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { Metiers, Page } from '../../../models/gestion-metier/gestion-metier';


@Injectable({
  providedIn: 'root'
})
export class GestionMetierService {

  private baseUrl = environment.apiUrl;
  private endpoint = `${this.baseUrl}/api/trades`;

  constructor(private http: HttpClient) {}

  /**
   * 🔹 Récupérer la liste des métiers (avec pagination)
   */
  getTrades(page = 0, size = 10): Observable<Page<Metiers>> {

    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<Page<Metiers>>(this.endpoint, { params });
  }
}
