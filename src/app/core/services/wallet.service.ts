import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';

export interface WalletApiData {
  walletType: number;
  balance: number;
  reservedBalance: number;
  availableBalance: number;
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(private http: HttpClient) {}

  getWalletBalances(): Observable<WalletApiData[]> {
    return this.http.get<WalletApiData[]>(`${environment.apiUrl}/wallet`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }

  getTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/wallet/transactions`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }
}