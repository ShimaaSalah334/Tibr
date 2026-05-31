export interface CreatePaymentRequest {
  amountCents: number;
  orderId: string | number;
  currency: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface PaymentInitiateResponse {
  paymentUrl: string;
}
