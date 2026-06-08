import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IProductFilter } from '../interfaces/iproduct-filter';
import { Observable } from 'rxjs';
import { IPaginatedResult } from '../interfaces/ipagination';
import { IProduct, IProductDetails } from '../interfaces/iproduct';
import { API_ENDPOINTS } from '../constants/api_endpoints';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  
  private http = inject(HttpClient);

  // User — filtered + paginated products
  getProducts(filter: IProductFilter = {}): Observable<IPaginatedResult<IProduct>> {
    const params = this.buildParams(filter);
    return this.http.get<IPaginatedResult<IProduct>>(
      API_ENDPOINTS.products.getAll, { params });
  }

  // Single product full details
  getProductById(id: number): Observable<IProductDetails> {
    return this.http.get<IProductDetails>(API_ENDPOINTS.products.getById(id));
  }

  // Check stock level
  getProductStock(id: number): Observable<{ productId: number; stock: number }> {
    return this.http.get<{ productId: number; stock: number }>(
      API_ENDPOINTS.products.getStock(id));
  }

  // Build HttpParams from filter object — only adds non-null/undefined values
  private buildParams(filter: IProductFilter): HttpParams {
    let params = new HttpParams();

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return params;
  }
  
}
