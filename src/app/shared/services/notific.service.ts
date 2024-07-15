import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificService {
  constructor(private http: HttpClient) { }

  sendSubscription2(subscription: any, userId: string) {
    const url = `${environment.api}/pushSubscription/logeo`;
    const body = { subscription, userId };
    return this.http.post(url, body);
  }
  sendSubscription(subscription: any) {
    const url = `${environment.api}/pushSubscription`;
    return this.http.post(url, subscription);
  }
}
