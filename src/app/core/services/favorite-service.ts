import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api_endpoints';
import { IFavoriteItem } from '../interfaces/ifavorite-item';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private http = inject(HttpClient);

  /** Toggle favorite for the current user and a product */
  toggleFavorite(productId: number): Observable<any> {
    return this.http.post(API_ENDPOINTS.favorites.toggle(productId), {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }

  /** Check whether the current user has favorited a product */
  isFavorite(productId: number): Observable<boolean> {
    return this.http.get<boolean>(API_ENDPOINTS.favorites.check(productId), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }

  /** Get favorites list for current user */
  getMyFavorites(): Observable<IFavoriteItem[]> {
    return this.http.get<IFavoriteItem[]>(API_ENDPOINTS.favorites.myList, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }
}
