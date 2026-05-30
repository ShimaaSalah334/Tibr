/**
 * Order status lifecycle:
 *
 *   Pending    → Order placed, awaiting payment confirmation
 *   Confirmed  → Payment verified, order accepted and queued
 *   Processing → Being prepared for shipment
 *   Shipped    → Dispatched and on its way
 *   Delivered  → Successfully delivered to customer
 *   Cancelled  → Order cancelled (only possible from Pending or Confirmed)
 *
 * Payment status:
 *   Pending    → Awaiting payment processing
 *   Paid       → Payment received successfully
 *   Failed     → Payment declined or failed
 *   Refunded   → Payment returned to customer
 */

export interface Order {
  id: string | number;
  userId: number;
  userFullName: string;
  orderNumber: string;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface CreateOrderDto {
  userId: number;
  items: CreateOrderItemDto[];
}

export interface CreateOrderItemDto {
  productId: number;
  quantity: number;
}

export interface UpdateOrderDto {
  paymentStatus?: string | null;
  orderStatus?: string | null;
}
