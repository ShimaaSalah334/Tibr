import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../../core/services/product-service';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct, IProductDetails } from '../../../core/interfaces/iproduct';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule,FormsModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit{
private productService = inject(ProductService);
private route          = inject(ActivatedRoute);
private router         = inject(Router);

  // Product state 
  product      = signal<IProductDetails | null>(null);
  isLoading    = signal<boolean>(false);
  error        = signal<string | null>(null);

 // ── Related products ──────────────────────────────────────
  relatedProducts    = signal<IProduct[]>([]);
  isLoadingRelated   = signal<boolean>(false);

ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  //  Data loaders 
  private loadProduct(id: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product.set(data);
        this.isLoading.set(false);
        this.loadRelatedProducts(data.metalType, data.categoryName);
      },
      error: (err) => {
        this.error.set('Product not found');
        this.isLoading.set(false);
      }
    });
  }

  private loadRelatedProducts(metalType: string, categoryName: string): void {
    this.isLoadingRelated.set(true);

    // metalType from API is "Gold"/"Silver" string
    // API expects "0" for Gold, "1" for Silver
    const metalTypeParam = metalType === 'Gold' ? '0' : '1';

    this.productService.getProducts({
      metalType:    metalTypeParam,
      categoryName: categoryName,
      pageSize:     6,
      pageNumber:   1,
    }).subscribe({
      next: (data) => {
        // Exclude current product from related
        const currentId = this.product()?.id;
        this.relatedProducts.set(
          data.items.filter(p => p.id !== currentId)
        );
        this.isLoadingRelated.set(false);
      },
      error: () => this.isLoadingRelated.set(false)
    });
  }

  //  Navigation 
  goToProducts(): void {
    this.router.navigate(['/products']);
  }

  goToRelatedProduct(id: number): void {
    this.router.navigate(['/products', id]);
    // Scroll to top when navigating to related product
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToProductsByCategory(categoryName: string): void {
    this.router.navigate(['/products'], {
      queryParams: { categoryName }
    });
  }

}
