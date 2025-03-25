import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Follow-ups
  getFollowUps(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/follow-ups`);
  }

  getFollowUpById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/follow-ups/${id}`);
  }

  createFollowUp(followUp: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/follow-ups`, followUp);
  }

  updateFollowUp(id: number, followUp: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/follow-ups/${id}`, followUp);
  }

  deleteFollowUp(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/follow-ups/${id}`);
  }

  // Clients
  getClients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/clients`);
  }

  getClientById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/clients/${id}`);
  }

  // Users
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`);
  }

  // Tags
  getTags(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tags`);
  }

  // Follow-up History
  getFollowUpHistory(followUpId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/follow-ups/${followUpId}/history`);
  }

  addFollowUpHistory(followUpId: number, history: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/follow-ups/${followUpId}/history`, history);
  }

  // Reminders
  getReminders(followUpId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/follow-ups/${followUpId}/reminders`);
  }

  createReminder(followUpId: number, reminder: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/follow-ups/${followUpId}/reminders`, reminder);
  }

  // Statistics
  getFollowUpStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats/follow-ups`);
  }

  getClientStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats/clients`);
  }
} 