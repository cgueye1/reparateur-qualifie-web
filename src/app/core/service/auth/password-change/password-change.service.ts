import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PasswordChange } from '../../../../models/auth/password-change/password-change';
import { environment } from '../../../../../environments/environments';


@Injectable({
  providedIn: 'root'
})
export class PasswordChangeService {

  private baseUrl = environment.apiUrl;
private endpoint = `${this.baseUrl}/api/v1/user/password/change`;

  constructor(private http: HttpClient) {}

  changePassword(id: number, data: PasswordChange): Observable<PasswordChange> {
    return this.http.put<PasswordChange>(`${this.endpoint}/${id}`, data);
  }
}
