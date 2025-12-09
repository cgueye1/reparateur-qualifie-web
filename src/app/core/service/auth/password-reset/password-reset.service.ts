import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PasswordReset } from '../../../../models/auth/password-reset/password-reset';


@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {

  private baseUrl = "https://innov.sn/reparateurs";
  private endpoint = this.baseUrl + "/api/auth/password/reset";

  constructor(private http: HttpClient) {}

  resetPassword(data: PasswordReset): Observable<any> {
    return this.http.post(this.endpoint, data);
  }

}
