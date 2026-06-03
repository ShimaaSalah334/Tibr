import {
  Component, inject, OnInit, OnDestroy, AfterViewInit,
  signal, computed
} from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ProductService }  from '../../../core/services/product-service';
import { CategoryService } from '../../../core/services/category-service';
import { ProductCard }     from '../../../shared/components/business/product-card/product-card';
import { IProduct }        from '../../../core/interfaces/iproduct';
import { ICategory }       from '../../../core/interfaces/icategory';
import { IPaginatedResult } from '../../../core/interfaces/ipagination';
import { IProductFilter, SortOption } from '../../../core/interfaces/iproduct-filter';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DecimalPipe, ProductCard],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit, OnDestroy, AfterViewInit {

  private productService  = inject(ProductService);
  private categoryService = inject(CategoryService);
  private cartService     = inject(CartService);    
  private router          = inject(Router);
  private route           = inject(ActivatedRoute);

  // ── State ─────────────────────────────────────────────────
  products          = signal<IProduct[]>([]);
  paginationData    = signal<IPaginatedResult<IProduct> | null>(null);
  isLoadingProducts = signal<boolean>(false);
  errorProducts     = signal<string | null>(null);

  categories = signal<ICategory[]>([]);

 // Cart state
  addingToCart = signal<number | null>(null);  // holds id being added
  cartSuccess  = signal<number | null>(null);  // holds id just added (for feedback)

  sidebarOpen = signal<boolean>(false);

  // Filters
  selectedMetalType = signal<string>('');
  selectedCategory  = signal<string>('');
  selectedPurity    = signal<number | null>(null);
  sortBy            = signal<SortOption>('newest');
  currentPage       = signal<number>(1);
  pageSize          = signal<number>(12);
  includeOutOfStock = signal<boolean>(true);

  // Range filters (for ngModel with sliders)
  minPriceInput:  number = 0;
  maxPriceInput:  number = 1000000;
  minWeightInput: number = 0;
  maxWeightInput: number = 1000;

  // Search
  searchKeyword          = signal<string>('');
  private searchTimeout: any;
  private lastSearchValue: string = '';

  // Purity options
  purityOptions = [
    { label: '585',   value: 0.585 },
    { label: '750',   value: 0.750 },
    { label: '875',   value: 0.875 },
    { label: '916',   value: 0.916 },
    { label: '999.9', value: 0.999 },
  ];

  // Sort options
  sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest',      label: 'Newest First' },
    { value: 'price_asc',   label: 'Price: Low to High' },
    { value: 'price_desc',  label: 'Price: High to Low' },
    { value: 'weight_asc',  label: 'Weight: Low to High' },
    { value: 'weight_desc', label: 'Weight: High to Low' },
    { value: 'purity_asc',  label: 'Purity: Low to High' },
    { value: 'purity_desc', label: 'Purity: High to Low' },
    { value: 'popularity',  label: 'Most Popular' },
  ];

  // ── Active filters computed ────────────────────────────────
  activeFilters = computed(() => {
    const f: { label: string; key: string }[] = [];
    if (this.selectedMetalType())
      f.push({ label: this.selectedMetalType() === '0' ? 'Gold' : 'Silver', key: 'metalType' });
    if (this.selectedCategory())
      f.push({ label: this.selectedCategory(), key: 'categoryName' });
    if (this.searchKeyword())
      f.push({ label: `"${this.searchKeyword()}"`, key: 'search' });
    if (this.selectedPurity())
      f.push({ label: `Purity ${this.selectedPurity()}`, key: 'purity' });
    if (this.minPriceInput > 0)
      f.push({ label: `Min ${this.minPriceInput.toLocaleString()} EGP`, key: 'minPrice' });
    if (this.maxPriceInput < 1000000)
      f.push({ label: `Max ${this.maxPriceInput.toLocaleString()} EGP`, key: 'maxPrice' });
    return f;
  });

  hasActiveFilters = computed(() => this.activeFilters().length > 0);

  // ── Lifecycle ─────────────────────────────────────────────
  ngOnInit(): void {
    this.loadCategories();
    this.readQueryParams();
    this.loadProducts();
  }

  ngAfterViewInit(): void {
    this.initScrollReveal();
  }

  ngOnDestroy(): void {
    clearTimeout(this.searchTimeout);
  }

  // ── Query params ───────────────────────────────────────────
  private readQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['categoryName']) this.selectedCategory.set(params['categoryName']);
      if (params['metalType'])    this.selectedMetalType.set(params['metalType']);
      if (params['sortBy'])       this.sortBy.set(params['sortBy']);
    });
  }

  // ── Load products ──────────────────────────────────────────
  loadProducts(): void {
    this.isLoadingProducts.set(true);
    this.errorProducts.set(null);

    const filter: IProductFilter = {
      pageNumber:        this.currentPage(),
      pageSize:          this.pageSize(),
      sortBy:            this.sortBy(),
      includeOutOfStock: this.includeOutOfStock(),
    };

    if (this.searchKeyword())     filter.searchKeyword = this.searchKeyword();
    if (this.selectedMetalType()) filter.metalType     = this.selectedMetalType();
    if (this.selectedCategory())  filter.categoryName  = this.selectedCategory();
    if (this.selectedPurity()) {
      filter.minPurity = this.selectedPurity()!;
      filter.maxPurity = this.selectedPurity()! + 0.001;
    }
    if (this.minPriceInput > 0)       filter.minPrice  = this.minPriceInput;
    if (this.maxPriceInput < 1000000) filter.maxPrice  = this.maxPriceInput;
    if (this.minWeightInput > 0)      filter.minWeight = this.minWeightInput;
    if (this.maxWeightInput < 1000)   filter.maxWeight = this.maxWeightInput;

    this.productService.getProducts(filter).subscribe({
      next: (data) => {
        this.products.set(data.items);
        this.paginationData.set(data);
        this.isLoadingProducts.set(false);
        setTimeout(() => this.initScrollReveal(), 80);
      },
      error: () => {
        this.errorProducts.set('Failed to load products. Please try again.');
        this.isLoadingProducts.set(false);
      }
    });
  }

  private loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: data => this.categories.set(data),
      error: ()  => {}
    });
  }

  // ── Search ─────────────────────────────────────────────────
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

  // ── Filter actions ─────────────────────────────────────────
  onMetalTypeChange(type: string): void {
    this.selectedMetalType.set(this.selectedMetalType() === type ? '' : type);
    this.currentPage.set(1);
    this.loadProducts();
  }

  onCategoryChange(name: string): void {
    this.selectedCategory.set(this.selectedCategory() === name ? '' : name);
    this.currentPage.set(1);
    this.loadProducts();
  }

  onSortChange(sort: SortOption): void {
    this.sortBy.set(sort);
    this.currentPage.set(1);
    this.loadProducts();
  }

  onPuritySelect(val: number): void {
    this.selectedPurity.set(this.selectedPurity() === val ? null : val);
    this.currentPage.set(1);
    this.loadProducts();
  }

  onPriceRangeChange(): void {
    this.currentPage.set(1);
    this.loadProducts();
  }

  onWeightRangeChange(): void {
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
      case 'metalType':    this.selectedMetalType.set('');  break;
      case 'categoryName': this.selectedCategory.set('');   break;
      case 'search':       this.clearSearch(); return;
      case 'purity':       this.selectedPurity.set(null);   break;
      case 'minPrice':     this.minPriceInput = 0;          break;
      case 'maxPrice':     this.maxPriceInput = 1000000;    break;
    }
    this.currentPage.set(1);
    this.loadProducts();
  }

  clearAllFilters(): void {
    this.selectedMetalType.set('');
    this.selectedCategory.set('');
    this.selectedPurity.set(null);
    this.sortBy.set('newest');
    this.minPriceInput  = 0;
    this.maxPriceInput  = 1000000;
    this.minWeightInput = 0;
    this.maxWeightInput = 1000;
    this.includeOutOfStock.set(true);
    this.clearSearch();
  }

  // ── Sidebar ────────────────────────────────────────────────
  openSidebar():  void { this.sidebarOpen.set(true); }
  closeSidebar(): void { this.sidebarOpen.set(false); }

  // ── Pagination ─────────────────────────────────────────────
  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  nextPage(): void {
    if (this.paginationData()?.hasNextPage) {
      this.currentPage.update(p => p + 1);
      this.loadProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevPage(): void {
    if (this.paginationData()?.hasPreviousPage) {
      this.currentPage.update(p => p - 1);
      this.loadProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPageNumbers(): number[] {
    const total = this.paginationData()?.totalPages ?? 0;
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  shouldShowPage(p: number): boolean {
    const curr  = this.currentPage();
    const total = this.paginationData()?.totalPages ?? 0;
    return p === 1 || p === total || (p >= curr - 1 && p <= curr + 1);
  }

  shouldShowEllipsis(p: number): boolean {
    const curr  = this.currentPage();
    const total = this.paginationData()?.totalPages ?? 0;
    return (p === 2 && curr > 3) || (p === total - 1 && curr < total - 2);
  }

  // ── Navigation ─────────────────────────────────────────────
  goToProductDetails(id: number): void {
    this.router.navigate(['/products', id]);
  }

  // ── Card output handlers ───────────────────────────────────
  onAddToCart(productId: number): void {
    if (this.addingToCart() !== null) return; // prevent double click

    this.addingToCart.set(productId);

    this.cartService.addToCart(productId, 1).subscribe({
      next: () => {
        this.addingToCart.set(null);
        this.cartSuccess.set(productId);

        // Clear success state after 2s
        setTimeout(() => {
          if (this.cartSuccess() === productId)
            this.cartSuccess.set(null);
        }, 2000);
      },
      error: (err) => {
        this.addingToCart.set(null);
        console.error('Failed to add to cart:', err);
        // TODO: show toast notification
      }
    });
  }

  onAddToFavorite(id: number): void {
    // TODO: inject WishlistService and toggle
    console.log('Add to favorite:', id);
  }

  // ── Helpers ────────────────────────────────────────────────
  min(a: number, b: number): number { return Math.min(a, b); }

  // ── Scroll reveal ──────────────────────────────────────────
  private initScrollReveal(): void {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('active');
      }),
      { threshold: 0.06 }
    );
    document.querySelectorAll('.reveal:not(.active)').forEach(el => observer.observe(el));
  }
}