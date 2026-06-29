import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService, BackendCartResponse, BackendCartItem } from '../../../core/services/cart.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { I18nService } from '../../../core/services/i18n.service';
import { IMAGE_BASE_URL } from '../../../core/constants/image-base-url';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, TranslatePipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private router = inject(Router);
  private i18n = inject(I18nService);

  cart = signal<BackendCartResponse | null>(null);
  imageBaseUrl = IMAGE_BASE_URL;
  isLoading = signal<boolean>(false);
  isClearing = signal<boolean>(false);
  removingItemId = signal<number | null>(null);
  error = signal<string | null>(null);
  info = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCart();
  }

  get hasItems(): boolean {
    return (this.cart()?.cartItems.length ?? 0) > 0;
  }

  get itemCount(): number {
    return this.cart()?.cartItems.length ?? 0;
  }

  get subtotal(): number {
    return this.cart()?.totalAmount
      ?? this.cart()?.cartItems.reduce((sum, item) => sum + this.getItemTotal(item), 0)
      ?? 0;
  }

  trackByCartItem(_: number, item: BackendCartItem): number {
    return item.id;
  }

  loadCart(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.cartService.getCartItems().subscribe({
      next: (response) => {
        this.cart.set(response);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load cart', err);
        this.error.set(this.i18n.translate('cart.error.load'));
        this.isLoading.set(false);
      },
    });
  }

  removeItem(cartItemId: number): void {
    if (this.removingItemId() !== null) {
      return;
    }

    this.removingItemId.set(cartItemId);
    this.error.set(null);

    this.cartService.removeCartItem(cartItemId).subscribe({
      next: (response) => {
        this.cart.set(response);
        this.removingItemId.set(null);
        this.setInfo(this.i18n.translate('cart.info.removed'));
      },
      error: (err) => {
        console.error('Failed to remove item', err);
        this.error.set(this.i18n.translate('cart.error.remove'));
        this.removingItemId.set(null);
      },
    });
  }

  clearCart(): void {
    if (this.isClearing()) {
      return;
    }

    this.isClearing.set(true);
    this.error.set(null);

    this.cartService.clearCart().subscribe({
      next: () => {
        this.cart.set({ userId: this.cart()?.userId ?? 0, cartItems: [], totalAmount: 0 });
        this.isClearing.set(false);
        this.setInfo(this.i18n.translate('cart.info.cleared'));
      },
      error: (err) => {
        console.error('Failed to clear cart', err);
        this.error.set(this.i18n.translate('cart.error.clear'));
        this.isClearing.set(false);
      },
    });
  }

  checkout(): void {
    if (!this.hasItems) {
      return;
    }

    this.router.navigate(['/checkout']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getItemTotal(item: BackendCartItem): number {
    return item.unitPrice * item.quantity;
  }

  private setInfo(message: string): void {
    this.info.set(message);
    setTimeout(() => {
      if (this.info() === message) {
        this.info.set(null);
      }
    }, 3000);
  }
}
