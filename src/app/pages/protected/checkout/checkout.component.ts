import { Component, inject, ViewChild } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CreateOrderDto } from '../../../core/interfaces/order.interface';
import { OrdersService } from '../../../core/services/orders.service';
import { PaymentService } from '../../../core/services/payment.service';
import { AddressFormComponent } from '../../../shared/components/ui/address-form/address-form.component';

interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-checkout',
  imports: [
    CurrencyPipe,
    AddressFormComponent,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  private ordersService = inject(OrdersService);
  private paymentService = inject(PaymentService);

  // TODO: Replace with teammate's cart service
  readonly cartItems: CartItem[] = [
    { productId: 1, productName: 'Gold Bar 10g', quantity: 1, price: 65000 },
    { productId: 2, productName: 'Silver Coin 1oz', quantity: 2, price: 1200 },
  ];

  // TODO: Replace with teammate's auth service
  private readonly userId = 1;
  private readonly user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '01000000000',
  };

  isSubmitting = false;
  error: string | null = null;
  success = false;

  @ViewChild(AddressFormComponent) addressForm!: AddressFormComponent;

  get subtotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }

  get total(): number {
    return this.subtotal;
  }

  placeOrder(): void {
    this.addressForm.form.markAllAsTouched();
    if (this.addressForm.form.invalid) return;

    this.isSubmitting = true;
    this.error = null;

    const dto: CreateOrderDto = {
      userId: this.userId,
      items: this.cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    this.ordersService.createOrder(dto).subscribe({
      next: (order) => {
        this.paymentService
          .initiatePayment({
            amountCents: Math.round(this.total * 100),
            orderId: order.id,
            currency: 'EGP',
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            email: this.user.email,
            phone: this.user.phone,
          })
          .subscribe({
            next: (response) => {
              window.location.href = response.paymentUrl;
            },
            error: () => {
              this.error = 'Payment initiation failed. Please try again.';
              this.isSubmitting = false;
            },
          });
      },
      error: () => {
        this.error = 'Failed to place order. Please try again.';
        this.isSubmitting = false;
      },
    });
  }
}
