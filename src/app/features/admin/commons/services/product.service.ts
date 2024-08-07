import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ADMINServicesModule } from './services.module'
import { Observable, catchError, forkJoin, map, tap } from 'rxjs'
import { IproductResponse } from '../../interfaces/Product.interface'
import { environment } from 'src/environments/environment'
import { Product } from '../../models/Product.models'
import { HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getById(id: string): Observable<IproductResponse> {
    return this.http.get<IproductResponse>(`${environment.api}/product/${id}`)
  }
  getMultipleByIds(ids: string[]): Observable<IproductResponse[]> {
    const requests = ids.map(id => this.getById(id));
    return forkJoin(requests);
  }
  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(
      `${environment.api}/product/${id}`,
      product,
    )
  }
  uploadImages(category: string, files: File[]): Observable<string[]> {
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append('images', file, `image-${index}-${file.name}`)
    })

    return this.http.post<string[]>(
      `${environment.api}/product/${category}/images`,
      formData,
    )
  }

  createProduct(formData: FormData): Observable<Product> {
    return this.http.post<Product>(`${environment.api}/product`, formData);
  }

  getAll(): Observable<Product[]> {
    // debugger
    return this.http.get<IproductResponse[]>(`${environment.api}/product`).pipe(
      map((originResponse: IproductResponse[]) => {
        return originResponse.map((item: IproductResponse) => new Product(item))
      }),
    )
  }


  // En el servicio de Angular
  getProducts(
    page: number,
    limit: number,
    filters: any,
  ): Observable<Product[]> {
    const skip = page * limit // Modificado para evitar problemas de paginación
    const requestPayload = {
      page,
      limit,
      filters,
      sortOrder: 'DESC', // Cambiado a DESC para orden descendente
    }

    return this.http.post<Product[]>(
      `${environment.api}/product/page/${limit}/${skip}`,
      requestPayload,
    )
  }

  // createProduct(product: Product): Observable<Product> {
  //   return this.http.post<Product>(`${environment.api}/product`, product);
  // }
  // updateProduct(productId: string, productData: Product): Observable<Product> {
  //   const url = `${this.apiUrl}/${productId}`;
  //   return this.http.put<Product>(url, productData, {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //     }),
  //   });
  // }


  deleteProduct(id: string): Observable<{ id: string }> {
    return this.http.delete<{ id: string }>(`${environment.api}/product/${id}`)
  }

  // updateProductImage(category: string, productId: string, position: number, file: File): Observable<any> {
  //   const formData: FormData = new FormData();
  //   formData.append('position', position.toString());
  //   formData.append('image', file, file.name);

  //   const url = `${environment.api}/product/${category}/${productId}/image`;

  //   return this.http.put(url, formData);
  // }

  updateProductStatus(id: string, status: string): Observable<Product> {
    const url = `${environment.api}/product/${id}/status`
    const body = { status } // Puedes enviar otros datos si es necesario

    return this.http.put<Product>(url, body)
  }
  deleteProductImage(productId: string, imageName: string): Observable<any> {
    const url = `${environment.api}/product/${productId}/${imageName}`
    return this.http.delete(url)
  }
}
