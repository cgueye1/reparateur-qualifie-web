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

  constructor(private http: HttpClient) {}

  signup(user: User): Observable<any> {
    return this.http.post(this.signupEndpoint, user);
  }
}
