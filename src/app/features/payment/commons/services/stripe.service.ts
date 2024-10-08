import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  constructor(private http: HttpClient) { }

  createCheckoutSession(body: any): Observable<any> {
    return this.http.post<any>(`${environment.api}/stripe/create-checkout-session`, body);
  }
  createCheckoutSession2(body: any): Observable<any> {
    return this.http.post<any>(`${environment.api}/stripe/create-checkout-session2`, body);
  }
}
