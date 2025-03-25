import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';
import { CardComponent } from '../shared/card/card.component';
import { FollowUpService } from '../../services/follow-up.service';
import { FollowUpDB, FollowUpHistory, Reminder } from '../../models/client.model';

// Interfaces
export type FollowUpStatus = 'new' | 'in-progress' | 'awaiting-response' | 'overdue' | 'completed';
export type FollowUpPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ContactMethod = 'email' | 'whatsapp' | 'sms' | 'call';
export type ViewMode = 'kanban' | 'list';

interface FollowUpNote {
  id: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  type: 'internal' | 'client-response' | 'voice';
  attachments?: string[];
}

interface Communication {
  id: string;
  method: ContactMethod;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  attachments?: string[];
}

interface AIRecommendation {
  bestTimeToContact: Date;
  engagementScore: number;
  suggestedTemplate?: string;
  reasoning: string;
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface FollowUp {
  id: string;
  clientName: string;
  companyName: string;
  title: string;
  status: FollowUpStatus;
  priority: FollowUpPriority;
  dueDate: Date;
  lastContactedDate?: Date;
  lastContactMethod?: ContactMethod;
  assignedTo: {
    id: string;
    name: string;
    avatar: string;
  };
  notes: FollowUpNote[];
  communications: Communication[];
  aiRecommendations?: AIRecommendation;
  tags: Tag[];
  attachments: string[];
  isRecurring: boolean;
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-follow-ups',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TimeAgoPipe,
    CardComponent
  ],
  templateUrl: './follow-ups.component.html',
  styleUrls: ['./follow-ups.component.css']
})
export class FollowUpsComponent implements OnInit, OnDestroy {
  // View state
  viewMode: ViewMode = 'kanban';
  
  // Filters
  statusFilter: string = 'all';
  priorityFilter: string = 'all';
  searchTerm = '';
  
  // Kanban columns
  readonly columns: string[] = ['pending', 'in_progress', 'completed', 'overdue'];
  
  // AI features
  aiEnabled = true;
  showAISuggestions = true;

  // Active dropdown
  activeDropdownId: number | null = null;

  // Cleanup
  private destroy$ = new Subject<void>();

  constructor(private followUpService: FollowUpService) {}

  ngOnInit(): void {
    this.setupNotifications();
    this.syncWithCalendar();
    this.setupDropdownClickOutside();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Dropdown methods
  toggleDropdown(id: number, event: Event): void {
    event.stopPropagation();
    this.activeDropdownId = this.activeDropdownId === id ? null : id;
  }

  private setupDropdownClickOutside(): void {
    document.addEventListener('click', () => {
      if (this.activeDropdownId) {
        this.activeDropdownId = null;
      }
    });
  }

  // View mode methods
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'kanban' ? 'list' : 'kanban';
  }

  // CRUD operations
  addFollowUp(followUp: Partial<FollowUpDB>): void {
    this.followUpService.createFollowUp(followUp)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (error) => console.error('Failed to create follow-up:', error)
      });
  }

  updateFollowUp(id: number, updates: Partial<FollowUpDB>): void {
    this.followUpService.updateFollowUp(id, updates)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (error) => console.error('Failed to update follow-up:', error)
      });
  }

  deleteFollowUp(id: number): void {
    this.followUpService.deleteFollowUp(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (error) => console.error('Failed to delete follow-up:', error)
      });
  }

  // Status management
  markAsCompleted(id: number): void {
    this.followUpService.markAsCompleted(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (error) => console.error('Failed to mark follow-up as completed:', error)
      });
  }

  async reschedule(id: number, newDate: Date): Promise<void> {
    try {
      await this.syncWithCalendar();
      this.followUpService.reschedule(id, newDate)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          error: (error) => console.error('Failed to reschedule follow-up:', error)
        });
    } catch (error) {
      console.error('Failed to sync with calendar:', error);
    }
  }

  // Communication methods
  async sendReminder(id: number, method: string): Promise<void> {
    try {
      const followUp = await this.followUpService.getFollowUpById(id).toPromise();
      if (!followUp) return;

      // Add to history
      await this.followUpService.addFollowUpHistory(id, {
        actionBy: { id: 1, fullName: 'Current User', email: 'user@example.com' } as any, // Replace with actual user
        status: followUp.status,
        actionNotes: `Reminder sent via ${method}`
      }).toPromise();

      // Create reminder
      await this.followUpService.createReminder(id, {
        reminderDate: new Date(),
        reminderStatus: 'sent'
      }).toPromise();

    } catch (error) {
      console.error('Failed to send reminder:', error);
    }
  }

  // Integration methods
  private async syncWithCalendar(): Promise<void> {
    try {
      // Implementation for calendar sync
      console.log('Syncing with calendar...');
    } catch (error) {
      console.error('Failed to sync with calendar:', error);
    }
  }

  private setupNotifications(): void {
    try {
      // Implementation for notification setup
      console.log('Setting up notifications...');
    } catch (error) {
      console.error('Failed to setup notifications:', error);
    }
  }

  // Getters for template
  get filteredFollowUps$() {
    return combineLatest([
      this.followUpService.getFollowUps(),
      new BehaviorSubject(this.statusFilter),
      new BehaviorSubject(this.priorityFilter),
      new BehaviorSubject(this.searchTerm)
    ]).pipe(
      map(([followUps, status, priority, search]) => {
        return followUps.filter(followUp => {
          const matchesStatus = status === 'all' || followUp.status === status;
          const matchesPriority = priority === 'all' || followUp.priority === priority;
          const matchesSearch = search === '' || 
            followUp.title.toLowerCase().includes(search.toLowerCase());
          
          return matchesStatus && matchesPriority && matchesSearch;
        });
      })
    );
  }

  getFollowUpsByStatus$(status: string) {
    return this.filteredFollowUps$.pipe(
      map(followUps => followUps.filter(followUp => followUp.status === status))
    );
  }

  // Helper methods for template
  isDropdownOpen(id: number): boolean {
    return this.activeDropdownId === id;
  }

  getDropdownClasses(id: number): { [key: string]: boolean } {
    return {
      'dropdown': true,
      'show': this.isDropdownOpen(id)
    };
  }
} 