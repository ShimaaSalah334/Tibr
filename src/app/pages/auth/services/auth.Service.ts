import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterPayload } from '../../../core/interfaces/register-payload';
import { API_ENDPOINTS } from '../../../core/constant/api.constant';
import { VerfiyAccountPayload } from '../../../core/interfaces/verfiy-account-payload';
import { KYCPayload } from '../../../core/interfaces/kyc-payload';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(API_ENDPOINTS.REGISTER, payload);
  }
  
  verfiyAccount(payload: VerfiyAccountPayload): Observable<any> {
    return this.http.post(API_ENDPOINTS.VERIFY_ACCOUNT, payload);
  }
  
  login(payload: { email: string; password: string; remember?: boolean }): Observable<any> {
    return this.http.post(API_ENDPOINTS.LOGIN, payload);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
  }

  resetPassword(payload: {
    email: string;
    otp: string;
    NewPassword: string;
    ConfirmPassword: string;
  }): Observable<any> {
    return this.http.post(API_ENDPOINTS.RESET_PASSWORD, payload);
  }

  resendOtp(email: string): Observable<any> {
    return this.http.post(API_ENDPOINTS.RESEND_OTP, {
      email,
    });
  }

  // Accept FormData for multipart uploads (files + fields)
  verifyKYC(payload: FormData | any): Observable<any> {
    return this.http.post(API_ENDPOINTS.VERIFY_KYC, payload);
  }
}
