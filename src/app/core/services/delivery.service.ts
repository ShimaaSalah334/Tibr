import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api_endpoints';
@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });
  }

  getAddresses(): Observable<any> {
    return this.http.get(`${API_ENDPOINTS.Address.getAll}`, { headers: this.getHeaders() });
  }

  createAddress(addressData: any): Observable<any> {
    return this.http.post(`${API_ENDPOINTS.Address.create}`, addressData, { headers: this.getHeaders() });
  }

  deleteAddress(id: number): Observable<any> {
    return this.http.delete(`${API_ENDPOINTS.Address.delete(id)}`, { headers: this.getHeaders() });
  }

  createDeliveryRequest(addressId: number, quantity: number, assetType: number): Observable<any> {
    const deliveryData = { addressId, quantity, assetType };
    return this.http.post(`${API_ENDPOINTS.Delivery.create}`, deliveryData, { headers: this.getHeaders() });
  }

  getDeliveryById(id: number): Observable<any> {
    return this.http.get(`${API_ENDPOINTS.Delivery.getById(id)}`, { headers: this.getHeaders() });
  }
}