import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreatePaymentRequest, PaymentInitiateResponse } from '../interfaces/payment.interface';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/Payment';

  initiatePayment(request: CreatePaymentRequest): Observable<PaymentInitiateResponse> {
    return this.http.post<PaymentInitiateResponse>(`${this.baseUrl}/initiate`, request);
  }
}
