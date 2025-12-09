import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {

  private baseUrl = "https://innov.sn/reparateurs";
  private endpoint = this.baseUrl + "/api/auth/refresh";

  constructor(private http: HttpClient) {}

  refreshToken(token: string): Observable<any> {
    return this.http.post(this.endpoint, { token });
  }

}
