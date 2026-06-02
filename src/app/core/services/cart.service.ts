import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BackendCategory {
  id: number;
  name: string;
}

export interface BackendProduct {
  id: number;
  categoryId: number;
  name: string;
  metalType: number; // 0 for Gold, 1 for Silver
  purity: number;
  weight: number;
  sellPrice: number;
  stock: number;
  category?: BackendCategory;
}

export interface BackendCartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  product: BackendProduct;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://localhost:7231/api/Cart';

  getCartItems(): Observable<BackendCartItem[]> {
    return this.http.get<BackendCartItem[]>(this.baseUrl);
  }

  addToCart(productId: number, quantity: number): Observable<BackendCartItem> {
    return this.http.post<BackendCartItem>(this.baseUrl, { productId, quantity });
  }

  updateCartItem(id: number, quantity: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, { id, quantity });
  }

  deleteCartItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
