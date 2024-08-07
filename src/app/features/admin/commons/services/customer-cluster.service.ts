import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerClusterService {
  // private apiUrl = 'https://proyecto-ins-modelo.onrender.com/cluster';
  private apiUrl = 'http://127.0.0.1:5000/cluster';


  // Obtener todas las órdenes
  getAllOrders(): Observable<any> {
    return this.http.get<any>(`${environment.api}/modelo`);
  }
  constructor(private http: HttpClient) {}

  getClusters(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}
