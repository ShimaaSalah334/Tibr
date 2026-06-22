import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api_endpoints';

export interface ReviewRequest {
  orderId: number;
  description?: string;
  value: number;
}

export interface ReviewResponse {
  id: number;
  orderId: number;
  description: string;
  value: number;
  createdAt: string;
  updatedAt: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) {}

  createReview(review: ReviewRequest): Observable<any> {
    return this.http.post(API_ENDPOINTS.reviews.create, review, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }

  getReviewByOrderId(orderId: number): Observable<ReviewResponse> {
    return this.http.get<ReviewResponse>(API_ENDPOINTS.reviews.getReview(orderId), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }
}