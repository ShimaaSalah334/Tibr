export interface IProductFilter {
    pageNumber?: number;
  pageSize?:  number;
  searchKeyword?: string;
  categoryId?:  number;
  categoryName?: string;
  metalType?:  string;   
  minWeight?:  number;
  maxWeight?:  number;
  minPurity?:  number;
  maxPurity?:  number;
  minPrice?:  number;
  maxPrice?:  number;
  status?:    string;
  sortBy?:   SortOption;
  includeOutOfStock?: boolean;
}

export type SortOption =
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'weight_asc'
  | 'weight_desc'
  | 'purity_asc'
  | 'purity_desc'
  | 'popularity';
