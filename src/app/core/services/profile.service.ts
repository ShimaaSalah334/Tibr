import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChangePasswordDto, UpdateProfileDto, UserProfileDto } from '../interfaces/profile';
import { API_ENDPOINTS } from '../constants/api_endpoints';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
 
  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserProfileDto> {
    return this.http.get<UserProfileDto>(`${API_ENDPOINTS.Profile.getProfile}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }

  updateProfile(dto: UpdateProfileDto): Observable<any> {
    return this.http.put<any>(`${API_ENDPOINTS.Profile.updateProfile}`, dto, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }

  changePassword(dto: ChangePasswordDto): Observable<any> {
    return this.http.put<any>(`${API_ENDPOINTS.Profile.changePassword}`, dto, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }
}