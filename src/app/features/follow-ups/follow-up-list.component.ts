import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FollowUp {
  id: number;
  title: string;
  type: 'client' | 'invoice' | 'meeting' | 'task';
  status: 'pending' | 'completed' | 'scheduled';
  dueDate: string;
  assignedTo: string;
  priority: 'high' | 'medium' | 'low';
}

@Component({
  selector: 'app-follow-up-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="follow-up-container">
      <div class="header">
        <h1>Follow-ups</h1>
        <button class="primary-button" (click)="showAddFollowUp()">
          <span class="material-icons">add</span>
          New Follow-up
        </button>
      </div>

      <!-- Filters -->
      <div class="filters">
        <div class="filter-group">
          <label>Type</label>
          <select [(ngModel)]="filters.type" (change)="applyFilters()">
            <option value="">All Types</option>
            <option value="client">Client</option>
            <option value="invoice">Invoice</option>
            <option value="meeting">Meeting</option>
            <option value="task">Task</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Status</label>
          <select [(ngModel)]="filters.status" (change)="applyFilters()">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Priority</label>
          <select [(ngModel)]="filters.priority" (change)="applyFilters()">
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div class="search-group">
          <input 
            type="text" 
            [(ngModel)]="filters.search" 
            (input)="applyFilters()"
            placeholder="Search follow-ups..."
          >
        </div>
      </div>

      <!-- Follow-up List -->
      <div class="follow-up-list">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Assigned To</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let followUp of filteredFollowUps">
                <td>{{ followUp.title }}</td>
                <td>
                  <span class="type-badge" [class]="followUp.type">
                    {{ followUp.type }}
                  </span>
                </td>
                <td>
                  <span class="status-badge" [class]="followUp.status">
                    {{ followUp.status }}
                  </span>
                </td>
                <td>{{ followUp.dueDate }}</td>
                <td>{{ followUp.assignedTo }}</td>
                <td>
                  <span class="priority-badge" [class]="followUp.priority">
                    {{ followUp.priority }}
                  </span>
                </td>
                <td class="actions">
                  <button class="icon-button" (click)="editFollowUp(followUp)">
                    <span class="material-icons">edit</span>
                  </button>
                  <button class="icon-button" (click)="completeFollowUp(followUp)">
                    <span class="material-icons">check_circle</span>
                  </button>
                  <button class="icon-button delete" (click)="deleteFollowUp(followUp)">
                    <span class="material-icons">delete</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .follow-up-container {
      padding: 1rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .primary-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: var(--primary-color, #667eea);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .filter-group,
    .search-group {
      flex: 1;
      min-width: 200px;
    }

    .filter-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--text-secondary);
    }

    .filter-group select,
    .search-group input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background: var(--input-bg, white);
      color: var(--text-color);
    }

    .table-container {
      background: var(--card-bg, white);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid var(--border-color);
    }

    th {
      background: var(--table-header-bg, #f8f9fa);
      color: var(--text-secondary);
      font-weight: 600;
    }

    .type-badge,
    .status-badge,
    .priority-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      text-transform: capitalize;
    }

    .type-badge.client {
      background: #e3f2fd;
      color: #1976d2;
    }

    .type-badge.invoice {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .type-badge.meeting {
      background: #e8f5e9;
      color: #388e3c;
    }

    .type-badge.task {
      background: #fff3e0;
      color: #f57c00;
    }

    .status-badge.pending {
      background: #fff3cd;
      color: #856404;
    }

    .status-badge.completed {
      background: #d4edda;
      color: #155724;
    }

    .status-badge.scheduled {
      background: #cce5ff;
      color: #004085;
    }

    .priority-badge.high {
      background: #f8d7da;
      color: #721c24;
    }

    .priority-badge.medium {
      background: #fff3cd;
      color: #856404;
    }

    .priority-badge.low {
      background: #d4edda;
      color: #155724;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .icon-button {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .icon-button:hover {
      background: var(--hover-color);
    }

    .icon-button.delete:hover {
      background: #ffebee;
      color: #d32f2f;
    }
  `]
})
export class FollowUpListComponent implements OnInit {
  followUps: FollowUp[] = [];
  filteredFollowUps: FollowUp[] = [];
  
  filters = {
    type: '',
    status: '',
    priority: '',
    search: ''
  };

  ngOnInit() {
    // TODO: Fetch follow-ups from backend
    this.followUps = [
      {
        id: 1,
        title: 'Client Meeting Follow-up',
        type: 'client',
        status: 'pending',
        dueDate: '2024-03-21 14:00',
        assignedTo: 'John Doe',
        priority: 'high'
      },
      {
        id: 2,
        title: 'Invoice Payment Reminder',
        type: 'invoice',
        status: 'scheduled',
        dueDate: '2024-03-22 10:00',
        assignedTo: 'Jane Smith',
        priority: 'medium'
      },
      {
        id: 3,
        title: 'Team Performance Review',
        type: 'meeting',
        status: 'completed',
        dueDate: '2024-03-19 15:30',
        assignedTo: 'John Doe',
        priority: 'low'
      }
    ];
    this.applyFilters();
  }

  applyFilters() {
    this.filteredFollowUps = this.followUps.filter(followUp => {
      const matchesType = !this.filters.type || followUp.type === this.filters.type;
      const matchesStatus = !this.filters.status || followUp.status === this.filters.status;
      const matchesPriority = !this.filters.priority || followUp.priority === this.filters.priority;
      const matchesSearch = !this.filters.search || 
        followUp.title.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        followUp.assignedTo.toLowerCase().includes(this.filters.search.toLowerCase());

      return matchesType && matchesStatus && matchesPriority && matchesSearch;
    });
  }

  showAddFollowUp() {
    // TODO: Implement add follow-up modal
    console.log('Add follow-up clicked');
  }

  editFollowUp(followUp: FollowUp) {
    // TODO: Implement edit follow-up
    console.log('Edit follow-up:', followUp);
  }

  completeFollowUp(followUp: FollowUp) {
    // TODO: Implement complete follow-up
    const index = this.followUps.findIndex(f => f.id === followUp.id);
    if (index !== -1) {
      this.followUps[index] = { ...followUp, status: 'completed' };
      this.applyFilters();
    }
  }

  deleteFollowUp(followUp: FollowUp) {
    // TODO: Implement delete confirmation and backend integration
    this.followUps = this.followUps.filter(f => f.id !== followUp.id);
    this.applyFilters();
  }
} 