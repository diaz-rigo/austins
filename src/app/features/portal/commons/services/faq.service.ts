import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
export interface FAQ {
  _id?: string;
  question: string;
  answer: string;
  createdAt?: Date;
  updatedAt?: Date;
}
@Injectable({
  providedIn: 'root'
})
export class FaqService {

  // private baseUrl = 'http://localhost:3000/faqs';  // URL base para la API
  private baseUrl = `${environment.api}/faqs`  // URL base para la API

  constructor(private http: HttpClient) { }

  // Obtener todas las preguntas frecuentes
  getFAQs(): Observable<FAQ[]> {
    return this.http.get<FAQ[]>(this.baseUrl);
  }

  // Crear una nueva pregunta frecuente
  createFAQ(faq: FAQ): Observable<FAQ> {
    return this.http.post<FAQ>(this.baseUrl, faq);
  }

  // Actualizar una pregunta frecuente
  updateFAQ(id: string, faq: FAQ): Observable<FAQ> {
    return this.http.put<FAQ>(`${this.baseUrl}/${id}`, faq);
  }

  // Eliminar una pregunta frecuente
  deleteFAQ(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
