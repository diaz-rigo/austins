import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private http: HttpClient) { }

  getEstadisticas(): Observable<any> {
    return this.http.get(`${environment.api}/admin/estadisticas`);
  }

  getEstadisticasPedidos(): Observable<any> {
    return this.http.get(`${environment.api}/admin/estadisticas_pedidos`);
  }

  getEstadisticasUsuarios(): Observable<any> {
    return this.http.get(`${environment.api}/admin/estadisticas_user`);
  }

  getEstadisticasProductos(): Observable<any> {
    return this.http.get(`${environment.api}/admin/estadisticas_product`);
  }
}
