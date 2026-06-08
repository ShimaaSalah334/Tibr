import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api_endpoints';

export interface TradeRequest {
  assetType: number;
  expectedPrice: number;
  quantity: number;
}

export interface TradeResponse {
  message?: string
}

@Injectable({
  providedIn: 'root',
})
export class TradeService {

  constructor(private http: HttpClient) {}


  buyTrade(assetType: number,quantity: number,expectedPrice: number): Observable<TradeResponse> {
    const payload: TradeRequest = {
      assetType: assetType,
      expectedPrice: expectedPrice,
      quantity: quantity
    };
    
    return this.http.post<TradeResponse>(`${API_ENDPOINTS.trade.executeBuyTrade}`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }

  sellTrade(assetType: number, quantity: number, expectedPrice: number): Observable<TradeResponse> {
    const payload: TradeRequest = {
      assetType: assetType,
      expectedPrice: expectedPrice,
      quantity: quantity
    };
    
    return this.http.post<TradeResponse>(`${API_ENDPOINTS.trade.executeSellTrade}`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }
}