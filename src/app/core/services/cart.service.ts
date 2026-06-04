import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api_endpoints';

export interface BackendCategory {
  id: number;
  name: string;
}

export interface BackendProduct {
  id: number;
  name: string;
  metalType: string; // "Gold" or "Silver"
  purity: number;
  weight: number;
  sellPrice: number;
  imageUrl: string;
  stock: number;
}
export interface BackendCartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  product: BackendProduct;
}

export interface BackendCartResponse {
  userId: number;
  cartItems: BackendCartItem[];
  totalAmount: number;
}

export interface AddToCartDto {
  productId: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly http = inject(HttpClient);

  getCartItems(): Observable<BackendCartResponse> {
    return this.http.get<BackendCartResponse>(API_ENDPOINTS.cart.getAll, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }

  addToCart(productId: number, quantity: number): Observable<BackendCartResponse> {
    const dto: AddToCartDto = { productId, quantity };
    return this.http.post<BackendCartResponse>(API_ENDPOINTS.cart.addItem, dto, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }

  removeCartItem(cartItemId: number): Observable<BackendCartResponse> {
    return this.http.delete<BackendCartResponse>(API_ENDPOINTS.cart.removeItem(cartItemId), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.cart.clear, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }
}
