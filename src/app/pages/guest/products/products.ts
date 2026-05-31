import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product-service';
import { CategoryService } from '../../../core/services/category-service';
import { IProduct } from '../../../core/interfaces/iproduct';
import { IPaginatedResult } from '../../../core/interfaces/ipagination';
import { IProductFilter, SortOption } from '../../../core/interfaces/iproduct-filter';
import { ICategory } from '../../../core/interfaces/icategory';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  imports: [CommonModule,FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit, OnDestroy {
  private productService  = inject(ProductService);
  private categoryService = inject(CategoryService);
  private route           = inject(ActivatedRoute);
  private router          = inject(Router);

  // Products state 
  products          = signal<IProduct[]>([]);
  paginationData    = signal<IPaginatedResult<IProduct> | null>(null);
  isLoadingProducts = signal<boolean>(false);
  errorProducts     = signal<string | null>(null);

  // ── Categories state ──────────────────────────────────────
  categories           = signal<ICategory[]>([]);
  isLoadingCategories  = signal<boolean>(false);
  errorCategories      = signal<string | null>(null);
  
   // Filter state 
  selectedMetalType    = signal<string>('');        // '' = all, '0' = gold, '1' = silver
  selectedCategory     = signal<string>('');        // '' = all
  sortBy               = signal<SortOption>('newest');
  currentPage          = signal<number>(1);
  pageSize             = signal<number>(12);
  includeOutOfStock    = signal<boolean>(false);

//  Search state 
  searchKeyword  = signal<string>('');
  private searchTimeout: any;
  private lastSearchValue: string = '';

  // Range filters
  minPrice  = signal<number | null>(null);
  maxPrice  = signal<number | null>(null);
  minWeight = signal<number | null>(null);
  maxWeight = signal<number | null>(null);
  minPurity = signal<number | null>(null);
  maxPurity = signal<number | null>(null);

// ── Computed active filters (for chips display) ───────────
  activeFilters = computed(() => {
    const filters: { label: string; key: string }[] = [];

    if (this.selectedMetalType()) 
      filters.push({ 
        label: this.selectedMetalType() === '0' ? 'Gold' : 'Silver', 
        key: 'metalType' 
      });
    if (this.selectedCategory())  
      filters.push({ label: this.selectedCategory(), key: 'categoryName' });
    if (this.searchKeyword())     
      filters.push({ label: `"${this.searchKeyword()}"`, key: 'search' });
    if (this.minPrice())          
      filters.push({ label: `Min Price: ${this.minPrice()} EGP`, key: 'minPrice' });
    if (this.maxPrice())          
      filters.push({ label: `Max Price: ${this.maxPrice()} EGP`, key: 'maxPrice' });
    if (this.minWeight())         
      filters.push({ label: `Min Weight: ${this.minWeight()}g`, key: 'minWeight' });
    if (this.maxWeight())         
      filters.push({ label: `Max Weight: ${this.maxWeight()}g`, key: 'maxWeight' });
    if (this.includeOutOfStock()) 
      filters.push({ label: 'Include Out of Stock', key: 'outOfStock' });

    return filters;
  });

  hasActiveFilters = computed(() => this.activeFilters().length > 0);

  // Sort options for dropdown
  sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest',      label: 'Newest' },
    { value: 'price_asc',   label: 'Price: Low to High' },
    { value: 'price_desc',  label: 'Price: High to Low' },
    { value: 'weight_asc',  label: 'Weight: Low to High' },
    { value: 'weight_desc', label: 'Weight: High to Low' },
    { value: 'purity_asc',  label: 'Purity: Low to High' },
    { value: 'purity_desc', label: 'Purity: High to Low' },
    { value: 'popularity',  label: 'Most Popular' },
  ];

  ngOnInit(): void {
    this.loadCategories();
    this.readQueryParams();
    this.loadProducts();
  }

  ngOnDestroy(): void {
  clearTimeout(this.searchTimeout);
}

  // Read query params from URL (from home category click) 
  private readQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['categoryName']) 
        this.selectedCategory.set(params['categoryName']);
      if (params['metalType'])    
        this.selectedMetalType.set(params['metalType']);
    });
  }

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


   private loadCategories(): void {
    this.isLoadingCategories.set(true);
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


 //  Search 
  onSearchChange(value: string): void {
  clearTimeout(this.searchTimeout);
  this.searchTimeout = setTimeout(() => {
    if (value === this.lastSearchValue) return;
    this.lastSearchValue = value;
    this.searchKeyword.set(value);
    this.currentPage.set(1);
    this.loadProducts();
  }, 500);
}

clearSearch(): void {
  this.searchKeyword.set('');
  this.lastSearchValue = '';
  clearTimeout(this.searchTimeout);
  this.currentPage.set(1);
  this.loadProducts();
}

  //  Filter actions 
   onMetalTypeChange(metalType: string): void {
    // Toggle — if same clicked again, deselect
    this.selectedMetalType.set(
      this.selectedMetalType() === metalType ? '' : metalType
    );
    this.currentPage.set(1);
    this.loadProducts();
  }

 onCategoryChange(categoryName: string): void {
    // Toggle — if same clicked again, deselect
    this.selectedCategory.set(
      this.selectedCategory() === categoryName ? '' : categoryName
    );
    this.currentPage.set(1);
    this.loadProducts();
  }

  onSortChange(sort: SortOption): void {
    this.sortBy.set(sort);
    this.currentPage.set(1);
    this.loadProducts();
  }

  onPriceRangeChange(min: number | null, max: number | null): void {
    this.minPrice.set(min);
    this.maxPrice.set(max);
    this.currentPage.set(1);
    this.loadProducts();
  }

   onWeightRangeChange(min: number | null, max: number | null): void {
    this.minWeight.set(min);
    this.maxWeight.set(max);
    this.currentPage.set(1);
    this.loadProducts();
  }

  onPurityRangeChange(min: number | null, max: number | null): void {
    this.minPurity.set(min);
    this.maxPurity.set(max);
    this.currentPage.set(1);
    this.loadProducts();
  }

  onStockToggle(): void {
    this.includeOutOfStock.set(!this.includeOutOfStock());
    this.currentPage.set(1);
    this.loadProducts();
  }


  removeFilter(key: string): void {
    switch (key) {
      case 'metalType':   this.selectedMetalType.set('');    break;
      case 'categoryName':this.selectedCategory.set('');     break;
      case 'search':      this.searchKeyword.set('');        break;
      case 'minPrice':    this.minPrice.set(null);           break;
      case 'maxPrice':    this.maxPrice.set(null);           break;
      case 'minWeight':   this.minWeight.set(null);          break;
      case 'maxWeight':   this.maxWeight.set(null);          break;
      case 'outOfStock':  this.includeOutOfStock.set(false); break;
    }
    this.currentPage.set(1);
    this.loadProducts();
  }

   clearAllFilters(): void {
    this.selectedMetalType.set('');
    this.selectedCategory.set('');
    this.searchKeyword.set('');
    this.sortBy.set('newest');
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.minWeight.set(null);
    this.maxWeight.set(null);
    this.minPurity.set(null);
    this.maxPurity.set(null);
    this.includeOutOfStock.set(false);
    this.currentPage.set(1);
    this.loadProducts();
  }


  //  Pagination 
  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadProducts();
  }

  nextPage(): void {
    if (this.paginationData()?.hasNextPage) {
      this.currentPage.update(p => p + 1);
      this.loadProducts();
    }
  }

  prevPage(): void {
    if (this.paginationData()?.hasPreviousPage) {
      this.currentPage.update(p => p - 1);
      this.loadProducts();
    }
  }


  // Generate page numbers array for template
  getPageNumbers(): number[] {
    const total = this.paginationData()?.totalPages ?? 0;
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  //  Navigation 
  goToProductDetails(id: number): void {
    this.router.navigate(['/products', id]);
  }
}
