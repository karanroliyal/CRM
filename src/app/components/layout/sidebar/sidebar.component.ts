import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  logoUrl$ = new BehaviorSubject<string>('assets/images/logo.png');
  
  menuItems: MenuItem[] = [
    { icon: 'bi bi-grid', label: 'Dashboard', route: '/dashboard' },
    { icon: 'bi bi-person', label: 'Clients', route: '/clients', badge: 3 },
    { icon: 'bi bi-bell', label: 'Follow-ups', route: '/follow-ups', badge: 5 },
    { icon: 'bi bi-calendar', label: 'Calendar', route: '/calendar' },
    { icon: 'bi bi-chat', label: 'Messages', route: '/messages', badge: 2 },
    { icon: 'bi bi-file-text', label: 'Reports', route: '/reports' },
    { icon: 'bi bi-gear', label: 'Settings', route: '/settings' }
  ];

  constructor() {}

  ngOnInit(): void {
    // Initialize any necessary data
  }

  isActive(route: string): boolean {
    return window.location.pathname.startsWith(route);
  }
} 