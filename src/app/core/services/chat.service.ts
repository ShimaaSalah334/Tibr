import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api_endpoints';
export interface ApiMessage {
  id?: number;
  role: 'User' | 'Assistant';
  content: string;
  createdAt: string;
}

export interface ChatResponse {
  reply: string;
  conversationId: number;
  intent: string;
  source?: string;
  language?: string;
}

export interface ConversationSession {
  id: number;
  title: string;
  lastMessage?: string;
  messageCount: number;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
 
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });
  }

  // POST /
  sendMessage(
    message: string,
    conversationId: number | null,
    intent: string = 'planner',
    language: string = 'ar'
  ): Observable<ChatResponse> {
    const payload: Record<string, unknown> = { message, language };
    if (conversationId !== null) payload['conversationId'] = conversationId;
    if (intent) payload['intent'] = intent;
    return this.http.post<ChatResponse>(API_ENDPOINTS.chatAi.getChat, payload, { headers: this.getHeaders() });
  }

  // GET /conversations
  getConversationsHistory(): Observable<ConversationSession[]> {
    return this.http.get<ConversationSession[]>(API_ENDPOINTS.chatAi.conversations, { headers: this.getHeaders() });
  }

  // GET /conversations/{id}
  getConversationById(id: number): Observable<{ id: number; title: string; messages: ApiMessage[] }> {
    return this.http.get<{ id: number; title: string; messages: ApiMessage[] }>(API_ENDPOINTS.chatAi.getConversationsById(id), { headers: this.getHeaders() });
  }

  // DELETE /conversations/{id}
  deleteConversation(id: number): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.chatAi.deleteConversations(id), { headers: this.getHeaders() });
  }
}