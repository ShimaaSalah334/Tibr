import { Component, input, output } from '@angular/core';
import { IProduct } from '../../../../core/interfaces/iproduct';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
 // Inputs 
  product = input.required<IProduct>();

  // Outputs 
  viewDetails   = output<number>();
  addToCart     = output<number>();
  addToFavorite = output<number>();

  // ── Actions ───────────────────────────────────────────────
  onViewDetails(): void {
    this.viewDetails.emit(this.product().id);
  }

  onAddToCart(): void {
    if (!this.isOutOfStock)
      this.addToCart.emit(this.product().id);
  }

  onAddToFavorite(): void {
    this.addToFavorite.emit(this.product().id);
  }
}
