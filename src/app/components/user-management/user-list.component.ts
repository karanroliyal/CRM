import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="user-management-container">
      <div class="header">
        <h1>User Management</h1>
        <button class="primary-button" (click)="showAddUserForm()">
          <span class="material-icons">add</span>
          Add User
        </button>
      </div>

      <!-- Add/Edit User Form -->
      <div class="user-form" *ngIf="showForm">
        <div class="form-card">
          <h2>{{ editingUser ? 'Edit User' : 'Add New User' }}</h2>
          <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" formControlName="name" placeholder="Enter name">
              <div class="error-message" *ngIf="userForm.get('name')?.errors?.['required'] && userForm.get('name')?.touched">
                Name is required
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" formControlName="email" placeholder="Enter email">
              <div class="error-message" *ngIf="userForm.get('email')?.errors?.['required'] && userForm.get('email')?.touched">
                Email is required
              </div>
              <div class="error-message" *ngIf="userForm.get('email')?.errors?.['email'] && userForm.get('email')?.touched">
                Please enter a valid email
              </div>
            </div>

            <div class="form-group">
              <label for="role">Role</label>
              <select id="role" formControlName="role">
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="user">User</option>
              </select>
            </div>

            <div class="form-actions">
              <button type="button" class="secondary-button" (click)="cancelForm()">Cancel</button>
              <button type="submit" class="primary-button" [disabled]="userForm.invalid">
                {{ editingUser ? 'Update' : 'Add' }} User
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- User List -->
      <div class="user-list">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of users">
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="role-badge" [class]="user.role">{{ user.role }}</span>
                </td>
                <td>
                  <span class="status-badge" [class]="user.status">{{ user.status }}</span>
                </td>
                <td>{{ user.lastLogin }}</td>
                <td class="actions">
                  <button class="icon-button" (click)="editUser(user)">
                    <span class="material-icons">edit</span>
                  </button>
                  <button class="icon-button delete" (click)="deleteUser(user)">
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
    .user-management-container {
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

    .primary-button:hover {
      background: var(--primary-dark, #5a6fd6);
    }

    .secondary-button {
      padding: 0.5rem 1rem;
      background: transparent;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .secondary-button:hover {
      background: var(--hover-color);
    }

    .user-form {
      margin-bottom: 2rem;
    }

    .form-card {
      background: var(--card-bg, white);
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--text-color);
    }

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background: var(--input-bg, white);
      color: var(--text-color);
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1.5rem;
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

    .role-badge,
    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .role-badge.admin {
      background: #e3f2fd;
      color: #1976d2;
    }

    .role-badge.manager {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .role-badge.user {
      background: #e8f5e9;
      color: #388e3c;
    }

    .status-badge.active {
      background: #d4edda;
      color: #155724;
    }

    .status-badge.inactive {
      background: #f8d7da;
      color: #721c24;
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

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  userForm: FormGroup;
  showForm = false;
  editingUser: User | null = null;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['user', Validators.required]
    });
  }

  ngOnInit() {
    // TODO: Fetch users from backend
    this.users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        status: 'active',
        lastLogin: '2024-03-20 10:30 AM'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'manager',
        status: 'active',
        lastLogin: '2024-03-19 03:45 PM'
      }
    ];
  }

  showAddUserForm() {
    this.showForm = true;
    this.editingUser = null;
    this.userForm.reset({ role: 'user' });
  }

  editUser(user: User) {
    this.showForm = true;
    this.editingUser = user;
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role
    });
  }

  deleteUser(user: User) {
    // TODO: Implement delete confirmation and backend integration
    this.users = this.users.filter(u => u.id !== user.id);
  }

  cancelForm() {
    this.showForm = false;
    this.editingUser = null;
    this.userForm.reset();
  }

  onSubmit() {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      
      if (this.editingUser) {
        // Update existing user
        const updatedUser = { ...this.editingUser, ...userData };
        this.users = this.users.map(u => u.id === this.editingUser?.id ? updatedUser : u);
      } else {
        // Add new user
        const newUser: User = {
          id: this.users.length + 1,
          ...userData,
          status: 'active',
          lastLogin: 'Never'
        };
        this.users.push(newUser);
      }

      this.showForm = false;
      this.editingUser = null;
      this.userForm.reset();
    }
  }
} 