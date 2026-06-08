import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api_endpoints';

export interface DepositRequest {
  amount: number;
  paymentMethod: number;
}

export interface DepositResponse {
  checkoutUrl?: string
}

@Injectable({
  providedIn: 'root',
})
export class DepositService {

  constructor(private http: HttpClient) {}


  createDeposit(amount: number): Observable<DepositResponse> {
    const payload: DepositRequest = {
      amount: amount,
      paymentMethod:1
    };
    
    return this.http.post<DepositResponse>(`${API_ENDPOINTS.deposit.createDeposit}`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }
}