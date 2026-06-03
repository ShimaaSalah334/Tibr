export interface IPaginatedResult<T> {
  items:  T[];
  pageNumber: number;
  pageSize:  number;
  totalCount:  number;
  totalPages:  number;
  hasNextPage:  boolean;
  hasPreviousPage: boolean;
}
