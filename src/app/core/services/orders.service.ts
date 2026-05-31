import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, CreateOrderDto, UpdateOrderDto } from '../interfaces/order.interface';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/Orders';

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl);
  }

  getOrder(id: string | number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  getUserOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/user/${userId}`);
  }

  createOrder(dto: CreateOrderDto): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, dto);
  }

  updateOrder(id: string | number, dto: UpdateOrderDto): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/${id}`, dto);
  }

  deleteOrder(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
