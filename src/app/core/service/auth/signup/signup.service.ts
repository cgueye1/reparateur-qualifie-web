import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../../../models/user/user';
import { environment } from '../../../../../environments/environments';


@Injectable({
  providedIn: 'root'
})
export class SignupService {

  private baseUrl = environment.apiUrl;
  private signupEndpoint = `${this.baseUrl}/api/auth/signup`;

  constructor(private http: HttpClient) { }

  /**
   * Inscription d'un nouvel utilisateur
   * L'API attend un multipart/form-data
   */
  signup(user: any): Observable<any> {
    const formData = new FormData();

    // Ajouter tous les champs au FormData
    formData.append('nom', user.nom || '');
    formData.append('prenom', user.prenom || '');
    formData.append('email', user.email || '');
    formData.append('password', user.password || '');
    formData.append('telephone', user.telephone || '');
    formData.append('adress', user.adress || '');
    formData.append('profil', user.profil || 'ARTISAN');
    formData.append('lat', String(user.lat || 0));
    formData.append('lon', String(user.lon || 0));
    formData.append('description', user.description || '');

    // Photo vide si pas fournie
    if (user.photo) {
      formData.append('photo', user.photo);
    }

    return this.http.post(this.signupEndpoint, formData);
  }
}

