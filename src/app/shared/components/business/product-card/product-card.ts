import { Component, input, output } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { IProduct } from '../../../../core/interfaces/iproduct';
import { IMAGE_BASE_URL } from '../../../../core/constants/image-base-url';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, DecimalPipe, TranslatePipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  imageBaseUrl = IMAGE_BASE_URL;

  // ── Inputs ────────────────────────────────────────────────
  product = input.required<IProduct>();
 isAddingToCart = input<boolean>(false);  
  cartAdded      = input<boolean>(false); 

  // ── Outputs ───────────────────────────────────────────────
  viewDetails   = output<number>();
  addToCart     = output<number>();
  addToFavorite = output<number>();

  // ── Computed getters ──────────────────────────────────────
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

  // e.g. #AU-999-03
  get skuCode(): string {
  const metalCode = this.isGold ? 'AU' : 'AG';
  return `#${metalCode}-${this.product().weight}G-${this.product().id}`;
}

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

  // ── 3D tilt on mouse move ─────────────────────────────────
  onCardTilt(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x  = event.clientX - rect.left;
    const y  = event.clientY - rect.top;
    const cx = rect.width  / 2;
    const cy = rect.height / 2;
    const rotX =  (y - cy) / 22;
    const rotY = -(x - cx) / 22;
    card.style.transform =
      `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;
  }

  onCardResetTilt(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;
    card.style.transition = 'transform 0.55s cubic-bezier(0.2,1,0.3,1)';
    card.style.transform  =
      'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    setTimeout(() => (card.style.transition = ''), 550);
  }
}