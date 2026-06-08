import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategory } from '../interfaces/icategory';
import { API_ENDPOINTS } from '../constants/api_endpoints';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
   private http = inject(HttpClient);

  getAllCategories(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(API_ENDPOINTS.categories.getAll);
  }

  getCategoryById(id: number): Observable<ICategory> {
    return this.http.get<ICategory>(API_ENDPOINTS.categories.getById(id));
  }
}
