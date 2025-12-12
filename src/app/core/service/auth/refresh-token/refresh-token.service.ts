import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environments';


@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {

  private baseUrl = environment.apiUrl;
  private endpoint = `${this.baseUrl}/api/auth/refresh`;

  constructor(private http: HttpClient) {}

  refreshToken(token: string): Observable<any> {
    return this.http.post(this.endpoint, { token });
  }
}
