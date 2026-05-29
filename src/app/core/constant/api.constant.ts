import { environment } from "../environments/environment.development";

export const API_ENDPOINTS = {
  LOGIN: `${environment.apiUrl}/auth/login`,
  REGISTER: `${environment.apiUrl}/auth/register`,
  VERIFY_ACCOUNT: `${environment.apiUrl}/auth/verify-otp`,
  RESEND_OTP: `${environment.apiUrl}/auth/resend-otp`,
  FORGOT_PASSWORD: `${environment.apiUrl}/auth/forgot-password`,
  RESET_PASSWORD: `${environment.apiUrl}/auth/reset-password`,
  VERIFY_KYC: `${environment.apiUrl}/auth/submit-kyc`
};