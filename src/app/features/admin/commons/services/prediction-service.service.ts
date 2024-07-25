import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
interface PredictionData {
  price: number;
  quantity_sold: number;
  customer_rating: number;
  review_count: number;
  category: string;
  store_location: string;
  discount_offered: number;
  customer_age_group: string;
  purchase_day: string;
  promotion_applied: number;
  payment_method: string;
  delivery_method: string;
}

@Injectable({
  providedIn: 'root'
})
export class PredictionServiceService {

  private apiUrl = 'https://modelo-austins-product-popular.onrender.com/predict';

  constructor(private http: HttpClient) {}

  predict(data: PredictionData): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}
