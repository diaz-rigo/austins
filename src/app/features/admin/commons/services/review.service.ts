import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) {}


  addReview(review: any): Observable<any> {
    return this.http.post(`${environment.api}/review/add-review`, review);
   }

  getProductReviews(productId: string): Observable<any> {
    return this.http.get(`${environment.api}/review/${productId}/reviews`);
  }

  // getAll(): Observable<Product[]> {
  //   // debugger
  //   return this.http.get<IproductResponse[]>(`${environment.api}/product`).pipe(
  //     map((originResponse: IproductResponse[]) => {
  //       return originResponse.map(
  //         (item: IproductResponse) => new Product(item)
  //       );
  //     })
  //   );
  // }
}
