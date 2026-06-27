import { Component, inject, ViewChild, signal, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CreateOrderDto } from '../../../core/interfaces/order.interface';
import { OrdersService } from '../../../core/services/orders.service';
import { PaymentService } from '../../../core/services/payment.service';
import { CartService, BackendCartItem } from '../../../core/services/cart.service';
import { AddressFormComponent } from '../../../shared/components/ui/address-form/address-form.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { I18nService } from '../../../core/services/i18n.service';

interface CartItemDisplay {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    AddressFormComponent,
    TranslatePipe,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  private ordersService = inject(OrdersService);
  private paymentService = inject(PaymentService);
  private cartService = inject(CartService);
  private i18n = inject(I18nService);

  cartItems = signal<CartItemDisplay[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  // TODO: Replace with teammate's auth service
  private readonly userId = 1;
  private readonly user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '01000000000',
  };

  isSubmitting = false;
  success = false;

  @ViewChild(AddressFormComponent) addressForm!: AddressFormComponent;

  ngOnInit(): void {
    this.loadCart();
  }

  private loadCart(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.cartService.getCartItems().subscribe({
      next: (response) => {
        const items: CartItemDisplay[] = response.cartItems.map(item => ({
          productId: item.productId,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.unitPrice,
        }));
        this.cartItems.set(items);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load cart', err);
        this.error.set(this.i18n.translate('checkout.error.loadCart'));
        this.isLoading.set(false);
      },
    });
  }

  get subtotal(): number {
    return this.cartItems().reduce(
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
    this.error.set(null);

    const dto: CreateOrderDto = {
      userId: localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : this.userId,
      items: this.cartItems().map((item) => ({
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
              this.cartService.clearCart().subscribe({
                next: () => {
                  window.location.href = response.paymentUrl;
                },
                error: () => {
                  console.error('Failed to clear cart after order placement');
                  window.location.href = response.paymentUrl;
                },
              });
            },
            error: () => {
              this.error.set(this.i18n.translate('checkout.error.payment'));
              this.isSubmitting = false;
            },
          });
      },
      error: () => {
        this.error.set(this.i18n.translate('checkout.error.placeOrder'));
        this.isSubmitting = false;
      },
    });
  }
}
