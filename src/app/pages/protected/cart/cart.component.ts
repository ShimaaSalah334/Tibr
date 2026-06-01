import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

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
export class CartComponent {
  private router = inject(Router);

  // Active items in the cart
  cartItems: CartItem[] = [
    {
      id: 'item-1',
      name: 'Gold Bar - 10g',
      category: '24K Gold',
      metalType: 'Gold',
      purity: '999.9 Fine Gold',
      sku: 'TIBR-AU-010G',
      price: 18450,
      quantity: 1,
      inStock: true,
      weight: '10g',
      isSavedForLater: false,
    },
    {
      id: 'item-2',
      name: 'Silver Bar - 100g',
      category: 'Silver 999',
      metalType: 'Silver',
      purity: '999 Fine Silver',
      sku: 'TIBR-AG-100G',
      price: 3890,
      quantity: 1,
      inStock: true,
      weight: '100g',
      isSavedForLater: false,
    },
    {
      id: 'item-3',
      name: 'Egyptian Gold Pound',
      category: 'Au Coin',
      metalType: 'Gold',
      purity: '21K Gold (87.5% Pure)',
      sku: 'TIBR-AU-EGP8G',
      price: 14200,
      quantity: 1,
      inStock: true,
      weight: '8g',
      isSavedForLater: false,
    },
  ];

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

  // Active items helper (filtered for non-saved items)
  get activeItems(): CartItem[] {
    return this.cartItems.filter(item => !item.isSavedForLater);
  }

  // Get total quantity of active items
  get totalItemsCount(): number {
    return this.activeItems.reduce((count, item) => count + item.quantity, 0);
  }

  // Price calculations
  get subtotal(): number {
    return this.activeItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get vat(): number {
    return Math.round(this.subtotal * 0.14);
  }

  get total(): number {
    return this.subtotal + this.vat;
  }

  // Quantity Management
  incrementQuantity(item: CartItem): void {
    if (item.quantity < 99) {
      item.quantity++;
    }
  }

  decrementQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  onQuantityChange(item: CartItem, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 99) {
      item.quantity = value;
    } else {
      input.value = item.quantity.toString();
    }
  }

  // Remove Item
  removeItem(item: CartItem): void {
    // Save for undo
    this.recentlyRemovedItem = { ...item };
    
    // Clear previous timeout
    if (this.undoTimeout) {
      clearTimeout(this.undoTimeout);
    }
    
    // Remove from array
    this.cartItems = this.cartItems.filter(i => i.id !== item.id);
    
    // Set auto-dismiss timeout for undo banner (5 seconds)
    this.undoTimeout = setTimeout(() => {
      this.recentlyRemovedItem = null;
    }, 5000);
  }

  // Undo removal
  undoRemove(): void {
    if (this.recentlyRemovedItem) {
      this.cartItems.push(this.recentlyRemovedItem);
      // Sort items back to original order or custom order
      this.cartItems.sort((a, b) => a.id.localeCompare(b.id));
      this.recentlyRemovedItem = null;
      if (this.undoTimeout) {
        clearTimeout(this.undoTimeout);
      }
    }
  }

  // Save for Later
  saveForLater(item: CartItem): void {
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
