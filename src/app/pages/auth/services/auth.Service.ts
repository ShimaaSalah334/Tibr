import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterPayload } from '../../../core/interfaces/register-payload';
import { API_ENDPOINTS } from '../../../core/constants/api_endpoints';
import { VerfiyAccountPayload } from '../../../core/interfaces/verfiy-account-payload';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(API_ENDPOINTS.auth.register, payload);
  }
  
  verfiyAccount(payload: VerfiyAccountPayload): Observable<any> {
    return this.http.post(API_ENDPOINTS.auth.verifyAccount, payload);
  }
  
  login(payload: { email: string; password: string; remember?: boolean }): Observable<any> {
    return this.http.post(API_ENDPOINTS.auth.login, payload);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(API_ENDPOINTS.auth.forgotPassword, { email });
  }

  resetPassword(payload: {
    email: string;
    otp: string;
    NewPassword: string;
    ConfirmPassword: string;
  }): Observable<any> {
    return this.http.post(API_ENDPOINTS.auth.resetPassword, payload);
  }

  resendOtp(email: string): Observable<any> {
    return this.http.post(API_ENDPOINTS.auth.resendOtp, {
      email,
    });
  }

  // Accept FormData for multipart uploads (files + fields)
  verifyKYC(payload: FormData | any): Observable<any> {
    return this.http.post(API_ENDPOINTS.auth.verifyKYC, payload);
  }
}
