import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WithdrawRequest } from '../interfaces/withdraw';
import { API_ENDPOINTS } from '../constants/api_endpoints';

@Injectable({
  providedIn: 'root'
})
export class WithdrawService {

  constructor(private http: HttpClient) {}

  createWithdrawal(payload: WithdrawRequest): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.withdraw.create, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }
}