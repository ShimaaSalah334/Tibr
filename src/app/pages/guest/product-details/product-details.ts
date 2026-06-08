import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { FavoriteService } from '../../../core/services/favorite.service';
import { CartService } from '../../../core/services/cart.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IProduct, IProductDetails } from '../../../core/interfaces/iproduct';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, FormsModule, RouterLink, TranslatePipe],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  private productService = inject(ProductService);
  private route          = inject(ActivatedRoute);
  private router         = inject(Router);
  private favoriteService = inject(FavoriteService);
  private cartService    = inject(CartService);

  // ── Product state ──────────────────────────────────────
  product    = signal<IProductDetails | null>(null);
  isLoading  = signal<boolean>(false);
  error      = signal<string | null>(null);

  // ── Cart state ─────────────────────────────────────────
  isAddingToCart = signal<boolean>(false);
  cartError      = signal<string | null>(null);
  cartSuccess    = signal<boolean>(false);

  // ── Related products ───────────────────────────────────
  relatedProducts  = signal<IProduct[]>([]);
  isLoadingRelated = signal<boolean>(false);

  // ── Favorite ───────────────────────────────────────────
  isFavorite = signal<boolean>(false);

  // ── Quantity slider ────────────────────────────────────
  // quantityGrams holds the current slider value (multiple of product.weight)
  quantityGrams = signal<number>(0);

  // Max purchasable quantity: min of stock and an arbitrary display cap
  maxQuantity = computed(() => {
    const stock = this.product()?.stock ?? 0;
    const weight = this.product()?.weight ?? 1;
    // Cap at 100 bars or available stock, whichever is lower
    return Math.min(stock, weight * 100);
  });

  // How many "bars" (units of product.weight) the user selected
  quantityBars = computed(() => {
    const weight = this.product()?.weight ?? 1;
    return Math.round(this.quantityGrams() / weight);
  });

  // Percentage for the glow-fill track overlay
  quantityPercent = computed(() => {
    const max = this.maxQuantity();
    if (!max) return 0;
    return (this.quantityGrams() / max) * 100;
  });

  // ── Investment calculator ──────────────────────────────
  calculatorMode  = signal<'grams' | 'egp'>('egp');
  calculatorInput = signal<number>(0);

  calculatorResult = computed(() => {
    const p = this.product();
    if (!p || !this.calculatorInput()) return null;

    if (this.calculatorMode() === 'egp') {
      const grams = this.calculatorInput() / p.buyPrice;
      return { label: 'You get', value: grams.toFixed(4), unit: 'grams' };
    } else {
      const egp = this.calculatorInput() * p.buyPrice;
      return { label: 'You pay', value: egp.toFixed(2), unit: 'EGP' };
    }
  });

  // ── Computed helpers ───────────────────────────────────
  isOutOfStock = computed(() => (this.product()?.stock ?? 0) === 0);

  isLowStock = computed(() => {
    const stock = this.product()?.stock ?? 0;
    return stock > 0 && stock <= 10;
  });

  stockPercentage = computed(() => {
    const stock = this.product()?.stock ?? 0;
    return Math.min((stock / 1000) * 100, 100);
  });

  // ── Lifecycle ──────────────────────────────────────────
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      if (id) this.loadProduct(id);
    });
  }

  // ── Data loaders ───────────────────────────────────────
  private loadProduct(id: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product.set(data);
        // Init quantity slider to 1 bar (product.weight)
        this.quantityGrams.set(data.weight);
        this.isLoading.set(false);
        this.loadRelatedProducts(data.metalType, data.categoryName);
        this.loadFavoriteState(data.id);
      },
      error: () => {
        this.error.set('Product not found');
        this.isLoading.set(false);
      }
    });
  }

  private loadRelatedProducts(metalType: string, categoryName: string): void {
    this.isLoadingRelated.set(true);
    const metalTypeParam = metalType === 'Gold' ? '0' : '1';

    this.productService.getProducts({
      metalType:    metalTypeParam,
      categoryName: categoryName,
      pageSize:     6,
      pageNumber:   1,
    }).subscribe({
      next: (data) => {
        const currentId = this.product()?.id;
        this.relatedProducts.set(data.items.filter(p => p.id !== currentId));
        this.isLoadingRelated.set(false);
      },
      error: () => this.isLoadingRelated.set(false)
    });
  }

  private loadFavoriteState(productId: number): void {
    this.favoriteService.isFavorite(productId).subscribe({
      next: (result) => {
        console.log('Favorite state for product', productId, ':', result);
        this.isFavorite.set(result)},
      error: (err) => {
        console.warn('Unable to load favorite state', err);
        this.isFavorite.set(false);
      }
    });
  }

  // ── Quantity slider ────────────────────────────────────
  onQuantityChange(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.quantityGrams.set(val);
  }

  // ── Cart & Purchase ────────────────────────────────────
  addToCart(): void {
    const p = this.product();
    if (!p) return;

    this.isAddingToCart.set(true);
    this.cartError.set(null);
    this.cartSuccess.set(false);

    this.cartService.addToCart(p.id, this.quantityGrams()).subscribe({
      next: () => {
        this.cartSuccess.set(true);
        this.isAddingToCart.set(false);
        // Clear success message after 3 seconds
        setTimeout(() => this.cartSuccess.set(false), 3000);
      },
      error: (err) => {
        console.error('Failed to add to cart:', err);
        this.cartError.set(err?.error?.error || 'Failed to add item to cart');
        this.isAddingToCart.set(false);
      }
    });
  }

  buyNow(): void {
    const p = this.product();
    if (!p) return;

    this.isAddingToCart.set(true);
    this.cartError.set(null);

    this.cartService.addToCart(p.id, this.quantityGrams()).subscribe({
      next: () => {
        this.isAddingToCart.set(false);
        this.router.navigate(['/checkout']);
      },
      error: (err) => {
        console.error('Failed to add to cart:', err);
        this.cartError.set(err?.error?.error || 'Failed to proceed with purchase');
        this.isAddingToCart.set(false);
      }
    });
  }

  // ── Favorite ───────────────────────────────────────────
  toggleFavorite(): void {
    const p = this.product();
    if (!p) return;

    // Optimistic update
    const previous = this.isFavorite();
    this.isFavorite.set(!previous);

    this.favoriteService.toggleFavorite(p.id).subscribe({
      next: () => {
        // success - keep optimistic state
      },
      error: (err) => {
        // revert optimistic update on error
        console.error('Failed to toggle favorite', err);
        this.isFavorite.set(previous);
      }
    });
  }

  // ── Calculator ─────────────────────────────────────────
  setCalculatorMode(mode: 'grams' | 'egp'): void {
    this.calculatorMode.set(mode);
    this.calculatorInput.set(0);
  }

  onCalculatorInput(value: number): void {
    this.calculatorInput.set(value);
  }

  // ── Navigation ─────────────────────────────────────────
  goToProducts(): void {
    this.router.navigate(['/products']);
  }

  goToRelatedProduct(id: number): void {
    this.router.navigate(['/products', id]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToProductsByCategory(categoryName: string): void {
    this.router.navigate(['/products'], { queryParams: { categoryName } });
  }
}