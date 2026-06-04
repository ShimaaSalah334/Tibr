import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreatePaymentRequest, PaymentInitiateResponse } from '../interfaces/payment.interface';
import { API_ENDPOINTS } from '../constants/api_endpoints';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly http = inject(HttpClient);

  initiatePayment(request: CreatePaymentRequest): Observable<PaymentInitiateResponse> {
    return this.http.post<PaymentInitiateResponse>(`${API_ENDPOINTS.payment.initiatePayment}`, request);
  }
}
