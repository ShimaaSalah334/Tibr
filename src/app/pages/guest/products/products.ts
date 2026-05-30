import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product-service';
import { CategoryService } from '../../../core/services/category-service';
import { IProduct } from '../../../core/interfaces/iproduct';
import { IPaginatedResult } from '../../../core/interfaces/ipagination';
import { IProductFilter, SortOption } from '../../../core/interfaces/iproduct-filter';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private productService  = inject(ProductService);
  private categoryService = inject(CategoryService);
  private route           = inject(ActivatedRoute);
  private router          = inject(Router);

  // Products state 
  products          = signal<IProduct[]>([]);
  paginationData    = signal<IPaginatedResult<IProduct> | null>(null);
  isLoadingProducts = signal<boolean>(false);
  errorProducts     = signal<string | null>(null);

   // Filter state 
  selectedMetalType    = signal<string>('');        // '' = all, '0' = gold, '1' = silver
  selectedCategory     = signal<string>('');        // '' = all
  searchKeyword        = signal<string>('');
  sortBy               = signal<SortOption>('newest');
  currentPage          = signal<number>(1);
  pageSize             = signal<number>(12);
  includeOutOfStock    = signal<boolean>(false);

  // Range filters
  minPrice  = signal<number | null>(null);
  maxPrice  = signal<number | null>(null);
  minWeight = signal<number | null>(null);
  maxWeight = signal<number | null>(null);
  minPurity = signal<number | null>(null);
  maxPurity = signal<number | null>(null);

    loadProducts(): void {
    this.isLoadingProducts.set(true);
    this.errorProducts.set(null);

    const filter: IProductFilter = {
      pageNumber:        this.currentPage(),
      pageSize:          this.pageSize(),
      sortBy:            this.sortBy(),
      includeOutOfStock: this.includeOutOfStock(),
    };

    // Only add if not empty
    if (this.searchKeyword())     filter.searchKeyword  = this.searchKeyword();
    if (this.selectedMetalType()) filter.metalType      = this.selectedMetalType();
    if (this.selectedCategory())  filter.categoryName   = this.selectedCategory();
    if (this.minPrice())          filter.minPrice       = this.minPrice()!;
    if (this.maxPrice())          filter.maxPrice       = this.maxPrice()!;
    if (this.minWeight())         filter.minWeight      = this.minWeight()!;
    if (this.maxWeight())         filter.maxWeight      = this.maxWeight()!;
    if (this.minPurity())         filter.minPurity      = this.minPurity()!;
    if (this.maxPurity())         filter.maxPurity      = this.maxPurity()!;

    this.productService.getProducts(filter).subscribe({
      next: (data) => {
        this.products.set(data.items);
        this.paginationData.set(data);
        this.isLoadingProducts.set(false);
      },
      error: (err) => {
        this.errorProducts.set('Failed to load products');
        this.isLoadingProducts.set(false);
      }
    });
  }
}
