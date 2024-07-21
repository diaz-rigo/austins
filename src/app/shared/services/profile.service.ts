import { User } from './../models/user.model';
// profile.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; // Importa la configuración de la URL base si es necesario

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getCompras(userId: string): Observable<any> {
    return this.http.get(`${environment.api}/publicR/compras/${userId}`);
  }
  getPedidos(userId: string): Observable<any> {
    return this.http.get(`${environment.api}/publicR/pedidos/${userId}`);
  }

  getUserById(userId: string): Observable<User> {
    const url = `${environment.api}/user/${userId}`; // Ajusta la URL según tu estructura de ruta en el backend
    return this.http.get<User>(url);
  }

  updateProfilePhoto(userId: string, imageUrl: string): Observable<any> {
    const url = `${environment.api}/perfil/${userId}/update-photo`;
    return this.http.put(url, { imageUrl });
  }
  updateUserProfile(userId: string, updatedData: Partial<User>): Observable<any> {
    const url = `${environment.api}/user/${userId}`;
    return this.http.put(url, updatedData);
  }
}
