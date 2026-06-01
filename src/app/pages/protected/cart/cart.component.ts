import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CartService, BackendCartItem } from '../../../core/services/cart.service';

export interface CartItem {
  id: string;
  name: string;
  category: string;
  metalType: 'Gold' | 'Silver';
  purity: string;
  sku: string;
  price: number;
  quantity: number;
  inStock: boolean;
  weight: string;
  isSavedForLater: boolean;
}

export interface MetalPrice {
  metal: string;
  purity: string;
  pricePerGram: number;
  changePercent: number;
  isPositive: boolean;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterLink,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private router = inject(Router);
  private cartService = inject(CartService);

  // Active items in the cart
  cartItems: CartItem[] = [];

  // Saved items list
  savedItems: CartItem[] = [];

  // Live precious metals market rates ticker
  liveMetalPrices: MetalPrice[] = [
    {
      metal: 'Gold',
      purity: '24K',
      pricePerGram: 3250,
      changePercent: 1.45,
      isPositive: true,
    },
    {
      metal: 'Gold',
      purity: '21K',
      pricePerGram: 2844,
      changePercent: 1.12,
      isPositive: true,
    },
    {
      metal: 'Silver',
      purity: '999',
      pricePerGram: 38.90,
      changePercent: -0.65,
      isPositive: false,
    },
  ];

  // Recently removed item for undo operation
  recentlyRemovedItem: CartItem | null = null;
  undoTimeout: any = null;

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = items.map((item) => this.mapBackendItemToCartItem(item));
      },
      error: (err) => {
        console.error('Failed to load cart items from API', err);
      },
    });
  }

  private mapBackendItemToCartItem(item: BackendCartItem): CartItem {
    return {
      id: item.id.toString(),
      name: item.product?.name || '',
      category: item.product?.category?.name || '24K Gold',
      metalType: item.product?.metalType === 0 ? 'Gold' : 'Silver',
      purity: item.product?.purity ? item.product.purity.toString() : '999.9',
      sku: item.product?.id ? item.product.id.toString() : '',
      price: item.unitPrice,
      quantity: item.quantity,
      inStock: item.product ? item.product.stock > 0 : false,
      weight: item.product?.weight ? item.product.weight.toString() + 'g' : '10g',
      isSavedForLater: false,
    };
  }

  // Active items helper (filtered for non-saved items)
  get activeItems(): CartItem[] {
    return this.cartItems.filter(item => !item.isSavedForLater);
  }

  // Get total quantity of active items
  get totalItemsCount(): number {
    return this.activeItems.reduce((count, item) => count + item.quantity, 0);
  }

  /* ==========================================================================
     تعديل مسميات الحسابات لتطابق الـ HTML بأقواس الميثود ()
     ========================================================================== */
  getSubtotal(): number {
    return this.activeItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getVat(): number {
    return Math.round(this.getSubtotal() * 0.14);
  }

  getTotal(): number {
    return this.getSubtotal() + this.getVat();
  }

  // Quantity Management
  incrementQuantity(item: CartItem): void {
    if (item.quantity < 99) {
      const newQuantity = item.quantity + 1;
      this.cartService.updateCartItem(Number(item.id), newQuantity).subscribe({
        next: () => {
          item.quantity = newQuantity;
        },
        error: (err) => {
          console.error('Failed to increment quantity', err);
        },
      });
    }
  }

  decrementQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      this.cartService.updateCartItem(Number(item.id), newQuantity).subscribe({
        next: () => {
          item.quantity = newQuantity;
        },
        error: (err) => {
          console.error('Failed to decrement quantity', err);
        },
      });
    }
  }

  onQuantityChange(item: CartItem, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 99) {
      this.cartService.updateCartItem(Number(item.id), value).subscribe({
        next: () => {
          item.quantity = value;
        },
        error: (err) => {
          console.error('Failed to update quantity', err);
          input.value = item.quantity.toString();
        },
      });
    } else {
      input.value = item.quantity.toString();
    }
  }

  // Remove Item
  removeItem(item: CartItem): void {
    this.cartService.deleteCartItem(Number(item.id)).subscribe({
      next: () => {
        this.recentlyRemovedItem = { ...item };
        
        if (this.undoTimeout) {
          clearTimeout(this.undoTimeout);
        }
        
        this.cartItems = this.cartItems.filter(i => i.id !== item.id);
        
        this.undoTimeout = setTimeout(() => {
          this.recentlyRemovedItem = null;
        }, 5000);
      },
      error: (err) => {
        console.error('Failed to remove item', err);
      },
    });
  }

  // Undo removal
  undoRemove(): void {
    if (this.recentlyRemovedItem) {
      const itemToRestore = { ...this.recentlyRemovedItem };
      const productId = Number(itemToRestore.sku);
      
      this.cartService.addToCart(productId, itemToRestore.quantity).subscribe({
        next: (newBackendItem) => {
          const restoredItem = this.mapBackendItemToCartItem(newBackendItem);
          this.cartItems.push(restoredItem);
          this.cartItems.sort((a, b) => a.id.localeCompare(b.id));
          this.recentlyRemovedItem = null;
          if (this.undoTimeout) {
            clearTimeout(this.undoTimeout);
          }
        },
        error: (err) => {
          console.error('Failed to restore item', err);
        },
      });
    }
  }

  /* ==========================================================================
     تعديل اسم الدالة لتطابق (click)="moveToSaved(item)" اللي في الـ HTML
     ========================================================================== */
  moveToSaved(item: CartItem): void {
    item.isSavedForLater = true;
  }

  // Move back to cart
  moveToCart(item: CartItem): void {
    item.isSavedForLater = false;
  }

  // Checkout redirect
  proceedToCheckout(): void {
    if (this.activeItems.length > 0) {
      this.router.navigate(['/checkout']);
    }
  }
}