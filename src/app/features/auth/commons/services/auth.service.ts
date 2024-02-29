import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  signUpAndVerifyEmail(data: any): Observable<any> {
    const url = `${environment.api}/auth/sign-up-and-verify-email`;
    return this.http.post(url, data);
  }

  signIn(data: any): Observable<any> {
    const url = `${environment.api}/auth/sign-in`;
    return this.http.post(url, data);
  }

  verifyEmail(token: string): Observable<any> {
    const url = `${environment.api}/auth/verify/${token}`;
    return this.http.get(url);
  }


  // requestPasswordRecovery(data: any): Observable<any> {
  //   const url = `${environment.api}/auth/request-password-recovery`;
  //   return this.http.post(url, data);
  // }
  // requestPasswordRecovery(data: any): Observable<any> {
  //   // return this.http.post<any>(`${this.apiUrl}/request-password-recovery`, data);
  //   const url = `${environment.api}/auth/request-password-recovery`;
  //   return this.http.post(url, data);
  // }

  requestPasswordRecovery(data: any): Observable<any> {
    const url = `${environment.api}/auth/request-password-recovery`;
    return this.http.post(url, data);
  }
  verifyCodeAndResetPassword(data: any): Observable<any> {
    const url = `${environment.api}/auth/verify-code-and-reset-password`;
    return this.http.post(url, data);
  }
  verifyVerificationCode(data: { email: string; verificationCode: string }): Observable<any> {
    const url = `${environment.api}/auth/verify-verification-code`; // Reemplaza con la ruta adecuada de tu backend
    return this.http.post(url, data);
  }
}
