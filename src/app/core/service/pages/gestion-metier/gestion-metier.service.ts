// src/app/core/service/gestion-metier/gestion-metier.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environments';
import { Metiers, Page } from '../../../../models/pages/gestion-metier/gestion-metier';

@Injectable({
  providedIn: 'root',
})
export class GestionMetierService {
  private baseUrl = environment.apiUrl;
  private endpoint = `${this.baseUrl}/api/trades`;

  constructor(private http: HttpClient) {}

  // ============================
  // 📌 LISTE
  // ============================
  getTrades(page = 0, size = 10): Observable<Page<Metiers>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Metiers>>(this.endpoint, { params });
  }

  // ============================
  // ➕ AJOUT
  // ============================
  addTrade(metier: Partial<Metiers>, file?: File): Observable<Metiers> {
    const formData = this.buildFormData(metier, file);
    return this.http.post<Metiers>(`${this.endpoint}/add`, formData);
  }

  // ============================
  // ✏️ MODIFICATION
  // ============================
  updateTrade(id: number, metier: Partial<Metiers>, file?: File): Observable<Metiers> {
    const formData = this.buildFormData(metier, file);
    return this.http.put<Metiers>(`${this.endpoint}/${id}`, formData);
  }

  // ============================
  // 🔧 MÉTHODE PRIVÉE
  // ============================
  private buildFormData(metier: Partial<Metiers>, file?: File): FormData {
    const formData = new FormData();

    if (metier.name) {
      formData.append('name', metier.name);
    }

    if (metier.description) {
      formData.append('description', metier.description);
    }

    if (file) {
      formData.append('img', file);
    }

    return formData;
  }




  // ============================
// 🗑️ SUPPRESSION
// ============================
deleteTrade(id: number): Observable<void> {
  return this.http.delete<void>(`${this.endpoint}/${id}`);
}

}
