import { Component, input, output } from '@angular/core';
import { IProduct } from '../../../../core/interfaces/iproduct';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
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

//  Computed helpers 
  get isGold(): boolean {
    return this.product().metalType === 'Gold';
  }

  get isSilver(): boolean {
    return this.product().metalType === 'Silver';
  }

 get isOutOfStock(): boolean {
    return this.product().stock === 0;
  }

  get isLowStock(): boolean {
    return this.product().stock > 0 && this.product().stock <= 10;
  }

  get stockPercentage(): number {
    return Math.min((this.product().stock / 1000) * 100, 100);
  }

  //  Actions 
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
