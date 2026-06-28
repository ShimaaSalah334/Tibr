import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiAcademyService {
  // أصبح الاتصال بالسيرفر المحلي الخاص بك
  private apiUrl = 'http://localhost:3000/api/chat';

  constructor(private http: HttpClient) {}

  askQuestion(question: string, sessionId: string): Observable<any> {
    const payload = { question };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl, payload, { headers });
  }
}