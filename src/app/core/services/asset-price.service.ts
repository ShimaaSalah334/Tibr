import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MarketPricesResponse } from '../interfaces/iasset-price';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api_endpoints';

@Injectable({
  providedIn: 'root',
})
export class AssetPrice {
   private readonly http = inject(HttpClient);

  getCurrentPrices(): Observable<MarketPricesResponse> {
    return this.http.get<MarketPricesResponse>(API_ENDPOINTS.assetPrice.getCurrentPrices, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }
}
