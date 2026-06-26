import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, CreateOrderDto, UpdateOrderDto } from '../interfaces/order.interface';
import { API_ENDPOINTS } from '../constants/api_endpoints';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/Orders';
  getOrders(id: string | number): Observable<Order[]> {
    return this.http.get<Order[]>(API_ENDPOINTS.orders.getAll(id), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }

  getOrder(id: string | number): Observable<Order> {
      return this.http.get<Order>(`${API_ENDPOINTS.orders.GetById(id)}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
    }

  getUserOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${API_ENDPOINTS.orders.GetByUserId(userId)}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }

  createOrder(dto: CreateOrderDto): Observable<Order> {
    return this.http.post<Order>(API_ENDPOINTS.orders.Create, dto, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }

  updateOrder(id: string | number, dto: UpdateOrderDto): Observable<Order> {
    return this.http.put<Order>(`${API_ENDPOINTS.orders.Update(id)}`, dto, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }

  deleteOrder(id: string | number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.orders.Delete(id)}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }
}
