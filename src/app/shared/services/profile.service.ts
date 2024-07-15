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

  getUserById(userId: string): Observable<User> {
    const url = `${environment.api}/user/${userId}`; // Ajusta la URL según tu estructura de ruta en el backend
    return this.http.get<User>(url);
  }
}