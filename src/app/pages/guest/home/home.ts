import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../../core/services/product-service';
import { CategoryService } from '../../../core/services/category-service';
import { Router } from '@angular/router';
import { ICategory } from '../../../core/interfaces/icategory';
import { IProduct } from '../../../core/interfaces/iproduct';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private router          = inject(Router);

  //  State signals
  categories       = signal<ICategory[]>([]);
  newestProducts   = signal<IProduct[]>([]);
  popularProducts  = signal<IProduct[]>([]);

  isLoadingCategories = signal<boolean>(false);
  isLoadingNewest     = signal<boolean>(false);
  isLoadingPopular    = signal<boolean>(false);

  errorCategories  = signal<string | null>(null);
  errorNewest      = signal<string | null>(null);
  errorPopular     = signal<string | null>(null);

  // Lifecycle
  ngOnInit(): void {
    this.loadCategories();
    this.loadNewestProducts();
    this.loadPopularProducts();
  }

  // Data loaders
  private loadCategories(): void {
    this.isLoadingCategories.set(true);
    this.errorCategories.set(null);

    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.isLoadingCategories.set(false);
      },
      error: (err) => {
        this.errorCategories.set('Failed to load categories');
        this.isLoadingCategories.set(false);
      }
    });
  }

  private loadNewestProducts(): void {
    this.isLoadingNewest.set(true);
    this.errorNewest.set(null);

    this.productService.getProducts({
      sortBy: 'newest',
      pageSize: 8,
      pageNumber: 1,
      includeOutOfStock: false
    }).subscribe({
      next: (data) => {
        this.newestProducts.set(data.items);
        this.isLoadingNewest.set(false);
      },
      error: (err) => {
        this.errorNewest.set('Failed to load newest products');
        this.isLoadingNewest.set(false);
      }
    });
  }

  private loadPopularProducts(): void {
    this.isLoadingPopular.set(true);
    this.errorPopular.set(null);

    this.productService.getProducts({
      sortBy: 'popularity',
      pageSize: 8,
      pageNumber: 1,
      includeOutOfStock: false
    }).subscribe({
      next: (data) => {
        this.popularProducts.set(data.items);
        this.isLoadingPopular.set(false);
      },
      error: (err) => {
        this.errorPopular.set('Failed to load popular products');
        this.isLoadingPopular.set(false);
      }
    });
  }

  // Navigation
  goToProducts(): void {
    this.router.navigate(['/products']);
  }

  goToProductsByCategory(categoryName: string): void {
    this.router.navigate(['/products'], {
      queryParams: { categoryName }
    });
  }

  goToProductDetails(id: number): void {
    this.router.navigate(['/products', id]);
  }
}
