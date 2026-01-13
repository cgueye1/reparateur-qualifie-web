import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environments';
import { LoginResponse } from '../../../../models/auth/login-response/login-response';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl = environment.apiUrl;

  private loginEndpoint = `${this.baseUrl}/api/auth/signin`;
  private logoutEndpoint = `${this.baseUrl}/api/auth/api/auth/logout`;

  constructor(private http: HttpClient) {}

  // 🔥 Maintenant typé proprement :
  login(data: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginEndpoint, data);
  }

  logout(): Observable<any> {
    return this.http.get(this.logoutEndpoint);
  }
}
