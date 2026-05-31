import { Component, inject, signal } from '@angular/core';
import { ProductService } from '../../../core/services/product-service';
import { ActivatedRoute, Router } from '@angular/router';
import { IProductDetails } from '../../../core/interfaces/iproduct';

@Component({
  selector: 'app-product-details',
  imports: [],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
private productService = inject(ProductService);
private route          = inject(ActivatedRoute);
private router         = inject(Router);

  // Product state 
  product      = signal<IProductDetails | null>(null);
  isLoading    = signal<boolean>(false);
  error        = signal<string | null>(null);

  //  Data loaders 
  private loadProduct(id: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Product not found');
        this.isLoading.set(false);
      }
    });
  }

}
