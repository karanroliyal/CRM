import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { DatabaseService } from './database.service';
import { FollowUpDB, FollowUpHistory, Reminder } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class FollowUpService {
  private followUpsSubject = new BehaviorSubject<FollowUpDB[]>([]);
  followUps$ = this.followUpsSubject.asObservable();

  constructor(private dbService: DatabaseService) {
    this.loadFollowUps();
  }

  private loadFollowUps(): void {
    this.dbService.getFollowUps().pipe(
      tap(followUps => this.followUpsSubject.next(followUps))
    ).subscribe();
  }

  getFollowUps(): Observable<FollowUpDB[]> {
    return this.followUps$;
  }

  getFollowUpById(id: number): Observable<FollowUpDB> {
    return this.dbService.getFollowUpById(id);
  }

  createFollowUp(followUp: Partial<FollowUpDB>): Observable<FollowUpDB> {
    return this.dbService.createFollowUp(followUp).pipe(
      tap(() => this.loadFollowUps())
    );
  }

  updateFollowUp(id: number, updates: Partial<FollowUpDB>): Observable<FollowUpDB> {
    return this.dbService.updateFollowUp(id, updates).pipe(
      tap(() => this.loadFollowUps())
    );
  }

  deleteFollowUp(id: number): Observable<void> {
    return this.dbService.deleteFollowUp(id).pipe(
      tap(() => this.loadFollowUps())
    );
  }

  markAsCompleted(id: number): Observable<FollowUpDB> {
    return this.updateFollowUp(id, {
      status: 'completed',
      completed_at: new Date()
    });
  }

  reschedule(id: number, newDate: Date): Observable<FollowUpDB> {
    return this.updateFollowUp(id, {
      due_date: newDate,
      status: 'pending'
    });
  }

  addFollowUpHistory(followUpId: number, history: Partial<FollowUpHistory>): Observable<FollowUpHistory> {
    return this.dbService.addFollowUpHistory(followUpId, history);
  }

  getFollowUpHistory(followUpId: number): Observable<FollowUpHistory[]> {
    return this.dbService.getFollowUpHistory(followUpId);
  }

  createReminder(followUpId: number, reminder: Partial<Reminder>): Observable<Reminder> {
    return this.dbService.createReminder(followUpId, reminder);
  }

  getReminders(followUpId: number): Observable<Reminder[]> {
    return this.dbService.getReminders(followUpId);
  }

  // Helper methods for filtering and statistics
  getFollowUpsByStatus(status: string): Observable<FollowUpDB[]> {
    return this.followUps$.pipe(
      map(followUps => followUps.filter(f => f.status === status))
    );
  }

  getFollowUpsByPriority(priority: string): Observable<FollowUpDB[]> {
    return this.followUps$.pipe(
      map(followUps => followUps.filter(f => f.priority === priority))
    );
  }

  getOverdueFollowUps(): Observable<FollowUpDB[]> {
    return this.followUps$.pipe(
      map(followUps => followUps.filter(f => 
        f.status !== 'completed' && 
        new Date(f.due_date) < new Date()
      ))
    );
  }

  getUpcomingFollowUps(days: number = 7): Observable<FollowUpDB[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return this.followUps$.pipe(
      map(followUps => followUps.filter(f => 
        f.status !== 'completed' && 
        new Date(f.due_date) <= futureDate
      ))
    );
  }

  getFollowUpStats(): Observable<any> {
    return this.dbService.getFollowUpStats();
  }
} 