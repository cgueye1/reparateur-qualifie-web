import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PasswordReset } from '../../../../models/auth/password-reset/password-reset';
import { environment } from '../../../../../environments/environments';


@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {

  private baseUrl = environment.apiUrl;
  private endpoint = `${this.baseUrl}/api/auth/password/reset`;

  constructor(private http: HttpClient) {}

  resetPassword(data: PasswordReset): Observable<string> {
  return this.http.post(
    this.endpoint,
    data,
    { responseType: 'text' } // 👈 TRÈS IMPORTANT
  );
}

}
