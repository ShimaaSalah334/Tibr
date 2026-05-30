export interface CreatePaymentRequest {
  amountCents: number;
  orderId: number;
  currency: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface PaymentInitiateResponse {
  paymentUrl: string;
}
