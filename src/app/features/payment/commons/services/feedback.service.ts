import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FeedbackSummary } from 'src/app/shared/models/feedback.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  private apiUrl = `${environment.api}/feedback`; // Cambia aquí la URL para el endpoint correcto
  // private apiUrl = 'http://localhost:3000/feedback'; // URL de la API en tu backend (para desarrollo local)

  constructor(private http: HttpClient) {}

  // Método para enviar feedback a la API
  sendFeedback(feedbackData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/save`, feedbackData, { headers });
  }

  // // Método para obtener feedback de la API
  // getFeedback(): Observable<any> {
  //   return this.http.get<any>(this.apiUrl);
  // }
  getFeedback(): Observable<FeedbackSummary> {
    return this.http.get<FeedbackSummary>(this.apiUrl);
  }
}
