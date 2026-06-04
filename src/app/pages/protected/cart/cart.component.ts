import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService, BackendCartResponse, BackendCartItem } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private router = inject(Router);

  cart = signal<BackendCartResponse | null>(null);
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
        this.error.set('Unable to load cart at this time.');
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
        this.setInfo('Item removed from your cart.');
      },
      error: (err) => {
        console.error('Failed to remove item', err);
        this.error.set('Unable to remove item from cart.');
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
        this.setInfo('Your cart has been cleared.');
      },
      error: (err) => {
        console.error('Failed to clear cart', err);
        this.error.set('Unable to clear cart right now.');
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
