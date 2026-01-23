import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environments';
import {
  UpdateUserPayload,
  UserConnected,
} from '../../../../models/user/userConnected';

@Injectable({
  providedIn: 'root',
})
export class MonCompteService {
  private baseUrl = environment.apiUrl;

  // 🔹 Endpoint pour l’utilisateur connecté
  private meEndpoint = `${this.baseUrl}/api/v1/user/me`;

  // 🔹 Endpoint pour mise à jour utilisateur
  private updateEndpoint = `${this.baseUrl}/api/v1/user/update`;

  constructor(private http: HttpClient) { }

  /**
   * 🔐 Récupérer les informations de l’utilisateur connecté
   */
  getMonCompte(): Observable<UserConnected> {
    return this.http.get<UserConnected>(this.meEndpoint);
  }

  /**
   * ✏️ Mettre à jour les informations de l’utilisateur
   * @param id ID de l’utilisateur
   * @param data Données à mettre à jour (FormData pour supporter l'upload de photo)
   */
  updateMonCompte(
    id: number,
    data: FormData
  ): Observable<UserConnected> {
    return this.http.put<UserConnected>(`${this.updateEndpoint}/${id}`, data);
  }
}
