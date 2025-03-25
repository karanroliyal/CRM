import { Component, OnInit, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  isDarkTheme = false;
  isSidebarCollapsed = false;

  ngOnInit() {
    // Load theme preference from localStorage
    this.isDarkTheme = localStorage.getItem('theme') === 'dark';
    
    // Set sidebar state based on screen size
    this.isSidebarCollapsed = window.innerWidth < 992;
    
    // Listen for window resize
    window.addEventListener('resize', () => {
      this.isSidebarCollapsed = window.innerWidth < 992;
    });
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
} 