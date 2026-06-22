import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateSupportDto } from '../interfaces/support';
import { API_ENDPOINTS } from '../constants/api_endpoints';

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  // Replace with your actual backend API URL
  constructor(private http: HttpClient) {}

  createSupport(supportData: CreateSupportDto): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.Support.create, supportData);
  }
}