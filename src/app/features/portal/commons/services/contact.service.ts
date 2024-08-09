import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) { }

  createContact(contact: any): Observable<any> {
    return this.http.post(`${environment.api}/contact`, contact);
  }

  getApprovedContacts(): Observable<any> {
    return this.http.get(`${environment.api}/contact/approved`);
  }

  getPendingContacts(): Observable<any> {
    return this.http.get(`${environment.api}/contact/pending`);
  }

  approveContact(id: string): Observable<any> {
    return this.http.patch(`${environment.api}/contact/approve/${id}`, {});
  }
}
