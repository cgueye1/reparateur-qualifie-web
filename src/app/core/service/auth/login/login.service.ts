import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl = "https://innov.sn/reparateurs";

  private loginEndpoint = this.baseUrl + "/api/auth/signin";
  private logoutEndpoint = this.baseUrl + "/api/auth/logout";

  constructor(private http: HttpClient) { }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(this.loginEndpoint, data);
  }

  logout(): Observable<any> {
    return this.http.get(this.logoutEndpoint);
  }

}
