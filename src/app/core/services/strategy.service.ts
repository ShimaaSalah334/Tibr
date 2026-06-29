// strategy.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api_endpoints';

// تعريف الـ Interfaces لضمان سلامة البيانات (Strong Typing)
export interface StrategyPayload {
  asset: 'gold' | 'silver';
  side: 'buy' | 'sell';
  quantity?: number;
  maxAmountEgp?: number;
  operator: 'less_than' | 'less_than_or_equal' | 'greater_than' | 'greater_than_or_equal' | 'equal';
  targetPriceEgp: number;
  executionType: 'alert_only' | 'auto_execute' | 'alert_and_execute';
  expiresAt?: string;
}

export interface StrategyResponse {
  id: number;
  userId: number;
  assetType: string;
  orderType: string;
  executionMode: string;
  executionType: string;
  quantity: number;
  maxAmountEgp?: number | null;
  requestedPrice: number;
  currentPrice: number;
  status: string;
  expiryDate: string;
  conditions: Array<{ conditionType: string; operator: string; targetValue: number }>;
  trades: any[];
}

@Injectable({
  providedIn: 'root'
})
export class StrategyService {

  constructor(private http: HttpClient) {}

  createStrategy(payload: StrategyPayload): Observable<StrategyResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    });

    return this.http.post<StrategyResponse>(API_ENDPOINTS.strategies.createStratege, payload, { headers });
  }

  getStrategies(): Observable<StrategyResponse[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    });
    return this.http.get<StrategyResponse[]>(API_ENDPOINTS.strategies.getStrateges, { headers });
  }
}