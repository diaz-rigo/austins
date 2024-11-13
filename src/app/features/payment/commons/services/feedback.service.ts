import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  private apiUrl = `${environment.api}/feedback/save`; // URL de la API en tu backend
  // private apiUrl = 'http://localhost:3000/feedback/save'; // URL de la API en tu backend

  constructor(private http: HttpClient) {}

  // Método para enviar feedback a la API
  sendFeedback(feedbackData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl, feedbackData, { headers });
  }
}
